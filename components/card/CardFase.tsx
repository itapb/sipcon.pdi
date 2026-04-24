import { useRouter } from 'expo-router';
import React, { type FC, type ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type P_CardFase = {
  color: string;
  name_fase: string;
  total: number;
  completed: number;
  icon: ReactNode;
  faseId: number;
  selectedFaseId: number;
};

export const CardFase: FC<P_CardFase> = ({
  color,
  name_fase,
  total,
  completed,
  icon,
  faseId,
  selectedFaseId,
}) => {
  const router = useRouter();
  const IsSameFase = Number(selectedFaseId) === Number(faseId);

  return (
    <TouchableOpacity
      onPress={() => {
        if (!IsSameFase) {
          router.setParams({ faseId: faseId.toString() });
        } else {
          router.setParams({ faseId: 0 });
        }
      }}
      activeOpacity={0.6}
      style={[styles.card, IsSameFase && styles.bordeSelected]}
    >
      <View style={styles.iconContainer}>{icon}</View>

      <Text style={styles.title} numberOfLines={1}>
        {name_fase}
      </Text>

      <View style={styles.counterContainer}>
        <Text style={[styles.completedText, { color }]}>{completed}</Text>
        <Text style={styles.totalText}>/{total}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    elevation: 2, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bordeSelected: {
    borderColor: '#3B82F6', // Azul vibrante para resaltar
    borderWidth: 2, // Un poco más grueso para que se note la selección
    backgroundColor: '#EFF6FF', // Un fondo azul muy tenue para dar profundidad
    shadowColor: '#5a8fe5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, // Sombra suave de color en Android
  },

  iconContainer: {
    marginBottom: 2,
    transform: [{ scale: 0.85 }],
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    marginBottom: 2,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  completedText: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
