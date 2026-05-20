import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const RestrictedAccess: FC = () => {
  return (
    <View style={styles.alertContainer}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons
          name='shield-lock-outline'
          size={28}
          color='#E11D48'
        />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.alertTitle}>Acceso Restringido</Text>
        <Text style={styles.alertSubtitle}>
          No tienes los permisos necesarios para modificar esta inspección.
          Contacta con tu supervisor.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF1F2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECDD3',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  iconWrapper: {
    backgroundColor: '#FFE4E6',
    padding: 10,
    borderRadius: 10,
    marginRight: 14,
  },
  textWrapper: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9F1239',
    marginBottom: 2,
  },
  alertSubtitle: {
    fontSize: 13,
    color: '#BE123C',
    lineHeight: 18,
    opacity: 0.8,
  },
});
