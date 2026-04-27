import { useAuthStore } from '@/store/useAuthStore';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen'; // Sugerido para evitar parpadeos
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { DefaultTheme, PaperProvider } from 'react-native-paper';

// Evitamos que el Splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const checkSession = useAuthStore((state) => state.checkSession); // Traemos la nueva función

  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        if (isLoggedIn) {
          await checkSession();
        }
      } catch (e) {
        console.error('Error validando sesión inicial:', e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync(); // Ocultamos el splash solo cuando ya sabemos quién es el usuario
      }
    }

    initialize();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === 'login';

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/login');
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/');
    }
  }, [isLoggedIn, segments, isReady]);

  const lightTheme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      text: 'black',
      onSurface: 'black',
    },
  };

  // Mientras isReady sea false, no renderizamos el árbol de navegación para evitar "flashes"
  if (!isReady) return null;

  return (
    <PaperProvider theme={lightTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name='login' />
        <Stack.Screen name='inspection/[id]' />
      </Stack>
      <StatusBar style='dark' />
    </PaperProvider>
  );
}
