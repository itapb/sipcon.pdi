import { useAuthStore } from '@/store/useAuthStore';
import { Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { user, area, logout, isLoggedIn } = useAuthStore();

  if (!isLoggedIn) return;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
      }}
    >
      <Text
        style={{ fontSize: 22, fontWeight: 'bold' }}
      >{`Hola, ${user}`}</Text>
      <Text style={{ fontSize: 16, color: '#666' }}>{`Área: ${area}`}</Text>

      <TouchableOpacity
        onPress={logout}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: 'red',
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white' }}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

