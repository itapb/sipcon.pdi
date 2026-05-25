import { CameraScanner } from '@/hooks/handles/camera/OpenCamera';
import {
  inspectionEventEmitter,
  TRIGGER_REFRESH_EVENT,
} from '@/utils/inspectionEvents';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, type FC } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ModalFiles } from '../modal/ModalFile';

type Props = {
  fileCount: number;
  recordID: number;
  userId: number;
  readOnly: boolean;
  moduleName: string;
  additional_styles?: object;
  onImageCaptured?: (uri: string) => void;
  hasFiles: boolean;
};

export const MediaActions: FC<Props> = (props) => {
  const [openFiles, setOpenFiles] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);

  // Se ejecuta cuando se toma una foto exitosa dentro de la cámara
  const handleCaptureFinished = (uri: string) => {
    if (props.onImageCaptured) {
      props.onImageCaptured(uri);
    }
    setOpenCamera(false);
    inspectionEventEmitter.emit(TRIGGER_REFRESH_EVENT);
  };

  // Se ejecuta cuando tocas la "X" para cerrar la cámara o al finalizar
  const handleCloseCamera = () => {
    setOpenCamera(false);
    inspectionEventEmitter.emit(TRIGGER_REFRESH_EVENT);
  };

  // Forzar recarga en la pantalla principal al alterar la galería (subir o borrar)
  const handleGalleryRefresh = () => {
    inspectionEventEmitter.emit(TRIGGER_REFRESH_EVENT);
  };

  return (
    <View style={[styles.iconsRow, props.additional_styles]}>
      {/* Botón de la cámara */}
      {!props.readOnly && (
        <TouchableOpacity
          onPress={() => setOpenCamera(true)}
          activeOpacity={0.6}
        >
          <MaterialCommunityIcons
            name='camera-outline'
            size={30}
            color='#B0BEC5'
            style={styles.iconCamera}
          />
        </TouchableOpacity>
      )}

      {/* Icono de la carpeta */}
      <TouchableOpacity
        onPress={() => setOpenFiles(true)}
        style={styles.folderContainer}
        activeOpacity={0.6}
      >
        <FontAwesome5 name='folder' size={28} color='#B0BEC5' />

        {props.hasFiles && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}></Text>
          </View>
        )}
      </TouchableOpacity>

      {/* MODAL DE LA CÁMARA */}
      <Modal
        visible={openCamera}
        animationType='slide'
        presentationStyle='fullScreen'
      >
        <CameraScanner
          onClose={handleCloseCamera}
          onCapture={handleCaptureFinished}
          recordId={props.recordID}
          moduleName={props.moduleName}
          userId={props.userId}
        />
      </Modal>

      {/* Modal para los archivos */}
      <ModalFiles
        visible={openFiles}
        onDismiss={setOpenFiles}
        onRefresh={handleGalleryRefresh}
        moduleName={props.moduleName}
        recordId={props.recordID}
        userId={props.userId}
        readOnly={props.readOnly}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCamera: {
    marginRight: 10,
  },
  folderContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -6,
    backgroundColor: '#2196F3',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
