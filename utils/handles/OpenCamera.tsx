import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const OpenCamera = async () => {
  // 1. Pedir permisos
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  if (permissionResult.granted === false) {
    Alert.alert(
      'Permiso denegado',
      'Es necesario el acceso a la cámara para realizar la inspección.',
    );
    return;
  }
  // 2. Lanzar la cámara optimizada para velocidad
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    quality: 0.6,
    base64: false,
    exif: false,
  });
  if (!result.canceled) {
    // Resulta instantáneo. La URI es local, temporalmente guardada en el caché.
    console.log('Foto capturada instantáneamente:', result.assets[0].uri);
  }
};
