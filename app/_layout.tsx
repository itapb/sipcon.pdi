import { useAuthStore } from '@/store/useAuthStore';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const segments = useSegments();
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
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

