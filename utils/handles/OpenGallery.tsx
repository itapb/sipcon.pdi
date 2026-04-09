import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const OpenGallery = async () => {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    Alert.alert('Permiso denegado', 'Es necesario el acceso a tus fotos.');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    // CAMBIO AQUÍ: Usar un array de strings o ImagePicker.MediaType
    mediaTypes: ['images', 'videos'],
    allowsMultipleSelection: true,
    selectionLimit: 5,
    quality: 0.6,
    allowsEditing: false,
  });

  if (!result.canceled) {
    return result.assets.map((asset) => asset.uri);
  }

  return null;
};
