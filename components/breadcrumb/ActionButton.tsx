import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  faseCompleted: boolean;
  handleCompletedFase: () => void;
  handleInitInspection: () => void;
  isItStarted: boolean;
  loading: boolean;
};

export const ActionButton: FC<Props> = (props) => {
  // Si la fase aún no se inicia
  if (!props.isItStarted) {
    return (
      <TouchableOpacity
        style={[styles.button, styles.green]}
        activeOpacity={0.7}
        onPress={props.handleInitInspection}
        disabled={props.loading}
      >
        <Text style={styles.buttonText}>Iniciar Fase</Text>
      </TouchableOpacity>
    );
  }

  // Boton para cerrar la fase
  if (!props.faseCompleted) {
    return (
      <TouchableOpacity
        style={[styles.button, styles.red]}
        activeOpacity={0.7}
        onPress={props.handleCompletedFase}
      >
        <Text style={styles.buttonText}>Cerrar Fase</Text>
      </TouchableOpacity>
    );
  }

  // Etiqueta de finalizada
  return (
    <View style={styles.completedBadge}>
      <MaterialCommunityIcons name='check-decagram' size={16} color='#22C55E' />
      <Text style={styles.completedText}>Finalizada</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  green: {
    backgroundColor: '#22C55E',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
    textTransform: 'uppercase',
  },
  red: {
    backgroundColor: '#EF4444',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  completedText: {
    color: '#166534',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 4,
  },
});
