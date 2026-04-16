import { POST_Attachment } from '@/utils/fetchs/attachment/POST_Attachment';
import { GetTime } from '@/utils/GetTime';
import { CameraView } from 'expo-camera';

type Props = {
  userId: number;
  moduleName: string;
  recordId: number;
  token: string;
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
        shutterSound: false,
      });
      if (photo) {
        console.log('✅ FOTO TOMADA:', photo.uri);
        // TODO: Ver que hago con este result
        const result = await POST_Attachment({
          recordId: props.recordId,
          userId: props.userId,
          moduleName: props.moduleName,
          token: props.token,
          file: {
            name: `photo_${GetTime()}.jpg`,
            type: 'image/jpeg',
            uri: photo.uri,
          },
        });
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
          maxFileSize: 8 * 1024 * 1024,
        });

        if (video) {
          const result = await POST_Attachment({
            recordId: props.recordId,
            userId: props.userId,
            moduleName: props.moduleName,
            file: {
              name: `video_${GetTime()}.mp4`,
              type: 'video/mp4',
              uri: video.uri,
            },
            token: props.token,
          });

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
