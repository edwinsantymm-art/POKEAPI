import { ScrollView, Text, StyleSheet } from 'react-native';
import ServiceCard from '@/assets/components/ServiceCard';
import { colors } from '@/styles/colors';

export default function ServiciosScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Servicios</Text>

      <ServiceCard
        icono="🔎"
        titulo="Buscar Pokémon"
        descripcion="Consultar Pokémon por nombre o número."
      />
      <ServiceCard
        icono="📖"
        titulo="Información"
        descripcion="Consultar información básica del Pokémon."
      />
      <ServiceCard icono="🖼️" titulo="Imágenes" descripcion="Mostrar artwork oficial." />
      <ServiceCard
        icono="🌐"
        titulo="PokéAPI"
        descripcion="Datos obtenidos desde PokéAPI a través de nuestro microservicio propio."
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.moradoOscuro,
    marginBottom: 16,
  },
});
