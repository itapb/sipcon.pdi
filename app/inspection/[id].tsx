import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function InspectionScreen() {
  // Capturamos el ID que viene de la URL dinámica /inspection/[id]
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de la Inspección</Text>

      <View style={styles.card}>
        <Text style={styles.label}>ID del Vehículo:</Text>
        <Text style={styles.idValue}>{id}</Text>
      </View>

      <Text style={styles.helperText}>
        Cargando datos para la unidad {id}...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  idValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  helperText: {
    marginTop: 20,
    color: '#888',
    fontStyle: 'italic',
  },
});
