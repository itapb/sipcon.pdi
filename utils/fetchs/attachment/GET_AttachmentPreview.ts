// Importamos desde la ruta /legacy para recuperar los miembros que TS no encuentra
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type DownloadProps = {
  attachmentId: number;
  userId: number;
  token: string;
  fileName: string;
};

export const GET_AttachmentPreview = async ({
  attachmentId,
  userId,
  token,
  fileName,
}: DownloadProps) => {
  try {
    // 1. Permisos con WRITE habilitado (true)
    const { status } = await MediaLibrary.requestPermissionsAsync(true);
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Debes permitir el acceso.');
      return null;
    }

    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
    const url = `${API_BASE}/Attachment/GetPreview?userId=${userId}&attachmentId=${attachmentId}`;

    const result = await FileSystem.downloadAsync(url, fileUri, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (result.status !== 200) {
      Alert.alert('Error', 'No se pudo descargar el video.');
      return null;
    }

    // 2. Verificación de extensión (Crítico para videos en Android)
    let assetUri = result.uri;
    console.log(assetUri);

    // Si es un video y no tiene extensión, MediaLibrary fallará silenciosamente
    if (!assetUri.endsWith('.mp4') && !assetUri.endsWith('.mov')) {
      // Opcional: puedes renombrarlo aquí si sabes que el API siempre manda video
      console.log(
        'Aviso: El archivo podría no tener extensión de video clara.',
      );
    }

    // 3. Guardado directo
    // Para videos, a veces saveToLibraryAsync es más confiable que createAsset
    await MediaLibrary.saveToLibraryAsync(assetUri);

    Alert.alert('Éxito', 'Video guardado en la galería.');
    return assetUri;
  } catch (error) {
    console.error('Error detallado:', error);
    Alert.alert(
      'Error',
      'No se pudo guardar el video. Si usas Expo Go, considera crear un Development Build.',
    );
    return null;
  }
};
