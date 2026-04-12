import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface LoadingProps {
  visible: boolean;
  message?: string;
}

export const LoadingScreen = ({
  visible,
  message = 'Cargando datos...',
}: LoadingProps) => {
  return (
    <Modal transparent visible={visible} animationType='fade'>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size='large' color='#2196F3' />
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
