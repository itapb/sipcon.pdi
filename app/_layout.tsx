import { useAuthStore } from '@/store/useAuthStore';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';

SplashScreen.preventAutoHideAsync();

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function RootLayout() {
  console.log({ API_BASE });

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const checkSession = useAuthStore((state) => state.checkSession);

  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        // Configuración para ocultar la barra nativa de Android
        if (Platform.OS === 'android') {
          // 'inset-swipe' es la opción correcta según tu tipado.
          // Oculta la barra y permite que aparezca temporalmente al deslizar.
          await NavigationBar.setBehaviorAsync('inset-swipe');
          await NavigationBar.setVisibilityAsync('hidden');
        }

        if (isLoggedIn) {
          await checkSession();
        }
      } catch (e) {
        console.error('Error inicializando:', e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
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
    ...MD3LightTheme,
    dark: false,
    colors: {
      ...MD3LightTheme.colors,
      background: '#FFFFFF',
      surface: '#FFFFFF',
      onSurface: '#000000',
    },
  };

  if (!isReady) return null;

  return (
    <PaperProvider theme={lightTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name='index' />
        <Stack.Screen name='login' />
        <Stack.Screen name='inspection/[id]' />
      </Stack>
      <StatusBar style='dark' backgroundColor='#FFFFFF' />
    </PaperProvider>
  );
}
