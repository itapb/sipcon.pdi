import React, { type FC, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type P_CardFase = {
  color: string;
  name_fase: string;
  total: number;
  completed: number;
  icon: ReactNode;
};

export const CardFase: FC<P_CardFase> = ({
  color,
  name_fase,
  total,
  completed,
  icon,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>{icon}</View>

      <Text style={styles.title}>{name_fase}</Text>

      <View style={styles.counterContainer}>
        <Text style={[styles.completedText, { color }]}>{completed}</Text>
        <Text style={styles.totalText}>/{total}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 120,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconContainer: {
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  completedText: {
    fontSize: 22,
    fontWeight: '700',
    paddingRight: 1,
  },
  totalText: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
