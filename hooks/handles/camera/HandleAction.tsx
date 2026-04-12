import { CameraView } from 'expo-camera';

type Props = {
  cameraRef: React.RefObject<CameraView | null>;
  isRecording: boolean;
  mode: 'picture' | 'video';
  onCapture: (uri: string, type: 'picture' | 'video') => void;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
};

export const HandleAction = async (props: Props) => {
  if (!props.cameraRef.current) {
    console.warn('Cámara no lista');
    return;
  }

  try {
    if (props.mode === 'picture') {
      console.log('📸 Capturando imagen...');
      const photo = await props.cameraRef.current.takePictureAsync({
        quality: 0.6,
        shutterSound: false, // A veces el sonido del obturador causa conflictos de hilos
      });
      if (photo) {
        console.log('✅ FOTO TOMADA:', photo.uri);
        props.onCapture(photo.uri, 'picture');
      }
    } else {
      if (props.isRecording) {
        console.log('stopRecording()');
        await props.cameraRef.current.stopRecording();
        props.setIsRecording(false);
      } else {
        props.setIsRecording(true);
        console.log('🎥 Iniciando grabación...');
        const video = await props.cameraRef.current.recordAsync({
          maxDuration: 60,
        });

        if (video) {
          console.log('✅ VIDEO GRABADO:', video.uri);
          props.onCapture(video.uri, 'video');
        }
      }
    }
  } catch (error) {
    console.error('❌ Error en HandleAction:', error);
    if (props.mode === 'video') props.setIsRecording(false);
  }
};
