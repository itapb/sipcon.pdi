import { POST_Attachment } from '@/utils/fetchs/attachment/POST_Attachment';
import { GetTime } from '@/utils/GetTime';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

type Props = {
  userId: number;
  moduleName: string;
  recordId: number;
  token: string;
};

export const OpenGallery = async (props: Props) => {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    Alert.alert('Permiso denegado', 'Es necesario el acceso a tus fotos.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images', 'videos'],
    allowsMultipleSelection: true,
    selectionLimit: 5,
    quality: 0.6,
    allowsEditing: false,
  });

  if (result.canceled) return;

  const MAX_SIZE = 8 * 1024 * 1024;

  // 3. Procesar y enviar cada archivo
  for (const asset of result.assets) {
    // Validación de tamaño (si la propiedad fileSize está disponible)
    if (asset.fileSize && asset.fileSize > MAX_SIZE) {
      const sizeMb = (asset.fileSize / (1024 * 1024)).toFixed(2);
      Alert.alert(
        'Archivo excedido',
        `El archivo pesa ${sizeMb} MB. El límite es de 8MB.`,
      );
      continue; // Salta al siguiente archivo
    }

    try {
      console.log(`Subiendo: ${asset.uri}`);

      await POST_Attachment({
        token: props.token,
        userId: props.userId,
        moduleName: props.moduleName,
        recordId: props.recordId,
        file: {
          uri: asset.uri,
          name:
            asset.fileName ??
            `upload_${GetTime()}.${asset.type === 'video' ? 'mp4' : 'jpg'}`,
          type:
            asset.mimeType ??
            (asset.type === 'video' ? 'video/mp4' : 'image/jpeg'),
        },
      });

      console.log('✅ Adjunto enviado con éxito');
    } catch (error) {
      console.error('❌ Error al subir el archivo:', error);
      Alert.alert('Error', 'No se pudo subir uno de los archivos.');
    }
  }

  Alert.alert('Completado', 'Se terminó de procesar la selección.');
};
