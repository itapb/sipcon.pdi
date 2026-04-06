import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    // Esperamos un instante a que el Layout esté listo
    const timeout = setTimeout(() => {
      router.replace('/login');
    }, 10);

    return () => clearTimeout(timeout); // Limpieza de memoria
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Cargando...</Text>
    </View>
  );
}

