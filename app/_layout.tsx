import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Expo detectará automáticamente index.tsx como la ruta principal */}
        <Stack.Screen name='index' />
        <Stack.Screen name='login' />
        <Stack.Screen name='inspection/index' />
      </Stack>
      <StatusBar style='dark' />
    </>
  );
}

