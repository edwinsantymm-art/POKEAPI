import { PokemonProvider } from '@/context/PokemonContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <PokemonProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PokemonProvider>
  );
}
