import { MaterialIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';

type Props = {
  loading: boolean;
  ManualRefresh: () => void;
  error: string;
};

export const ErrorHome: FC<Props> = (props) => {
  return (
    <>
      <MaterialIcons name='cloud-off' size={70} color='#EF4444' />
      <Text style={styles.errorTitle}>Error de Conexión</Text>
      <Text style={styles.errorSubtitle}>{props.error}</Text>
      <Button
        mode='contained'
        onPress={props.ManualRefresh}
        loading={props.loading}
        style={styles.retryButton}
        buttonColor='#2196F3'
      >
        Recargar Página
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 15,
  },
  errorSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 25,
  },
  retryButton: {
    paddingHorizontal: 15,
    borderRadius: 8,
  },
});
