import { PermissionResponse } from 'expo-camera';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  requestCameraPermission: () => Promise<PermissionResponse>;
  requestMicPermission: () => Promise<PermissionResponse>;
};

export const Permission = (props: Props) => {
  return (
    <View style={styles.center}>
      <Text style={styles.permissionText}>
        Se requieren permisos para la inspección
      </Text>
      <TouchableOpacity
        style={styles.permissionBtn}
        onPress={() => {
          props.requestCameraPermission();
          props.requestMicPermission();
        }}
      >
        <Text style={styles.link}>DAR PERMISOS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  permissionText: {
    color: 'white',
    marginBottom: 20,
  },
  permissionBtn: {
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  link: {
    color: 'white',
    fontWeight: 'bold',
  },
});
