import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from 'expo-camera';
import { FC, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HandleAction } from './HandleAction';
import { Permission } from './Permission';

type Props = {
  moduleName: string;
  recordId: number;
  userId: number;
  onClose: () => void;
  onCapture: (uri: string, type: 'picture' | 'video') => void;
};

export const CameraScanner: FC<Props> = ({
  recordId,
  userId,
  moduleName,
  onClose,
  onCapture,
}) => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const [mode, setMode] = useState<'picture' | 'video'>('picture');
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef<CameraView>(null);
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      blinkAnim.setValue(1);
    }
  }, [isRecording]);

  const toggleZoom = () => {
    setZoom((prev) => {
      if (prev === 0) return 0.3; // Simula un 2x
      if (prev === 0.3) return 0.7; // Simula un 3x
      return 0; // Vuelve a 1x
    });
  };

  const handleShutterPress = async () => {
    if (isUploading) return;

    // Si el modo es foto, activamos el loader local inmediatamente antes de procesar el archivo
    if (mode === 'picture') {
      setIsUploading(true);
    }

    try {
      await HandleAction({
        cameraRef,
        isRecording,
        mode,
        onCapture,
        setIsRecording,
        recordId,
        moduleName,
        userId,
      });
    } catch (error) {
      console.error('Error al procesar la acción multimedia:', error);
    } finally {
      // Quitamos el loader si algo falla o si terminó la captura de la foto
      if (mode === 'picture') {
        setIsUploading(false);
      }
    }
  };

  if (!cameraPermission || !micPermission)
    return <View style={styles.container} />;

  if (!cameraPermission.granted || !micPermission.granted) {
    return (
      <Permission
        requestCameraPermission={requestCameraPermission}
        requestMicPermission={requestMicPermission}
      />
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        videoQuality={'480p'}
        style={styles.camera}
        ref={cameraRef}
        mode={mode}
        facing={facing}
        enableTorch={mode === 'video' && flash === 'on'}
        flash={flash}
        zoom={zoom}
      />

      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onClose}
            disabled={isUploading}
          >
            <MaterialCommunityIcons name='close' size={28} color='white' />
          </TouchableOpacity>

          <View style={styles.rightIcons}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={toggleZoom}
              disabled={isUploading}
            >
              <Text style={styles.zoomText}>
                {zoom === 0 ? '1x' : zoom === 0.3 ? '2x' : '3x'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => setFlash((f) => (f === 'off' ? 'on' : 'off'))}
              disabled={isUploading}
            >
              <MaterialCommunityIcons
                name={flash === 'on' ? 'flash' : 'flash-off'}
                size={24}
                color='white'
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() =>
                setFacing((f) => (f === 'back' ? 'front' : 'back'))
              }
              disabled={isUploading}
            >
              <MaterialCommunityIcons
                name='camera-flip'
                size={24}
                color='white'
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Indicador de "GRABANDO" */}
        {isRecording && (
          <View style={styles.recIndicator}>
            <Animated.View style={[styles.redDot, { opacity: blinkAnim }]} />
            <Text style={styles.recText}>GRABANDO</Text>
          </View>
        )}

        {/* NUEVO: Indicador visual de subida/sincronización con el servidor */}
        {isUploading && (
          <View style={styles.uploadLoaderContainer}>
            <ActivityIndicator size='large' color='#FFFFFF' />
            <Text style={styles.uploadLoaderText}>Sincronizando foto...</Text>
          </View>
        )}

        {/* Menu de opciones inferior */}
        <View style={styles.bottomControls}>
          <View style={styles.modeSelector}>
            <TouchableOpacity
              onPress={() => !isRecording && !isUploading && setMode('picture')}
            >
              <Text
                style={[
                  styles.modeText,
                  mode === 'picture' && styles.activeMode,
                  isUploading && { opacity: 0.2 },
                ]}
              >
                FOTO
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => !isRecording && !isUploading && setMode('video')}
            >
              <Text
                style={[
                  styles.modeText,
                  mode === 'video' && styles.activeMode,
                  isUploading && { opacity: 0.2 },
                ]}
              >
                VIDEO
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botón de acciones */}
          <TouchableOpacity
            style={[
              styles.shutter,
              mode === 'video' && isRecording && styles.shutterRecording,
              isUploading && styles.shutterDisabled,
            ]}
            disabled={isUploading}
            onPress={handleShutterPress}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { ...StyleSheet.absoluteFillObject },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 50,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  rightIcons: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recIndicator: {
    position: 'absolute',
    top: 110,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  recText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF0000',
    marginRight: 10,
  },
  uploadLoaderContainer: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  uploadLoaderText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomControls: { alignItems: 'center', width: '100%' },
  modeSelector: { flexDirection: 'row', marginBottom: 20, gap: 40 },
  modeText: { color: 'white', fontWeight: 'bold', opacity: 0.5, fontSize: 13 },
  activeMode: { opacity: 1, borderBottomWidth: 2, borderBottomColor: 'white' },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  shutterRecording: {
    backgroundColor: '#FF5252',
    borderRadius: 10,
    transform: [{ scale: 0.8 }],
  },
  shutterDisabled: {
    backgroundColor: '#64748B',
    borderColor: 'rgba(100,116,139,0.3)',
  },
});
