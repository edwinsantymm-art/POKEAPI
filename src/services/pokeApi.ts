const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

export type PokedexData = {
  id: number;
  nombre: string;
  tipos: string[];
  altura: number;
  peso: number;
  habilidad: string;
  imagenPrincipal: string | null;
  imagenShiny: string | null;
  imagenTrasera: string | null;
  movimientos: string[];
  descripcion: string;
};

// Quita caracteres especiales (\f \n \r) de la descripcion
function limpiarTexto(texto: string): string {
  return texto
    .replace(/\f/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Normaliza la consulta: minusculas, sin espacios, sin ceros a la izquierda si es numero
// Ejemplos que deben funcionar: "Mew", "mew", "MEW", 151, "025", "25"
function normalizarConsulta(consulta: string): string {
  const valor = consulta.trim().toLowerCase();
  if (/^\d+$/.test(valor)) {
    return String(parseInt(valor, 10));
  }
  return valor;
}

function extraerDescripcion(especie: any): string {
  const entradas = especie?.flavor_text_entries || [];

  const enEspanol = entradas.find((entrada: any) => entrada.language?.name === 'es');
  if (enEspanol) return limpiarTexto(enEspanol.flavor_text);

  const enIngles = entradas.find((entrada: any) => entrada.language?.name === 'en');
  if (enIngles) return limpiarTexto(enIngles.flavor_text);

  return 'Descripción no disponible.';
}

export async function consultarPokemon(consulta: string): Promise<PokedexData> {
  const valor = normalizarConsulta(consulta);

  // 1) Datos principales del Pokemon
  let datos: any;
  try {
    const respuestaPokemon = await fetch(`${POKEAPI_BASE}/pokemon/${valor}`);

    if (respuestaPokemon.status === 404) {
      throw new Error('Pokémon no encontrado');
    }
    if (!respuestaPokemon.ok) {
      throw new Error('No se pudo conectar con PokéAPI. Revisa tu conexión a Internet.');
    }

    datos = await respuestaPokemon.json();
  } catch (error) {
    if (error instanceof Error && error.message === 'Pokémon no encontrado') {
      throw error;
    }
    throw new Error('No se pudo conectar con PokéAPI. Revisa tu conexión a Internet.');
  }

  // 2) Especie (para la descripcion en español). Si esto falla, no rompemos toda la búsqueda.
  let especie: any = { flavor_text_entries: [] };
  try {
    const respuestaEspecie = await fetch(`${POKEAPI_BASE}/pokemon-species/${datos.id}`);
    if (respuestaEspecie.ok) {
      especie = await respuestaEspecie.json();
    }
  } catch (error) {
    // seguimos sin descripcion en vez de romper toda la pantalla
  }

  return {
    id: datos.id,
    nombre: datos.name,
    tipos: datos.types.map((t: any) => t.type.name),
    altura: datos.height / 10, // decimetros -> metros
    peso: datos.weight / 10, // hectogramos -> kilogramos
    habilidad: datos.abilities?.[0]?.ability?.name ?? '—',
    imagenPrincipal:
      datos.sprites?.other?.['official-artwork']?.front_default ??
      datos.sprites?.front_default ??
      null,
    imagenShiny:
      datos.sprites?.other?.['official-artwork']?.front_shiny ??
      datos.sprites?.front_shiny ??
      null,
    imagenTrasera: datos.sprites?.back_default ?? null,
    movimientos: (datos.moves || []).slice(0, 4).map((m: any) => m.move.name),
    descripcion: extraerDescripcion(especie),
  };
}
