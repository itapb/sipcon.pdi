import { CameraView } from 'expo-camera';

type Props = {
  cameraRef: React.RefObject<CameraView | null>;
  isRecording: boolean;
  mode: 'picture' | 'video';
  onCapture: (uri: string, type: 'picture' | 'video') => void;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
};

export const HandleAction = async (props: Props) => {
  if (!props.cameraRef.current) return;

  try {
    if (props.mode === 'picture') {
      const photo = await props.cameraRef.current.takePictureAsync({
        quality: 0.6,
      });

      if (photo) {
        console.log('FOTO TOMADA: ', photo.uri);
        props.onCapture(photo.uri, 'picture');
      }
    } else {
      if (props.isRecording) {
        console.log('DETENIENDO VIDEO...');
        props.cameraRef.current.stopRecording();
        props.setIsRecording(false);
      } else {
        props.setIsRecording(true);
        console.log('GRABANDO VIDEO...');
        const video = await props.cameraRef.current.recordAsync({
          maxDuration: 60,
        });

        if (video) {
          console.log('VIDEO GRABADO: ', video.uri);

          props.onCapture(video.uri, 'video');
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
