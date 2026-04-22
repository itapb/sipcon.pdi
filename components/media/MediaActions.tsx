import { CameraScanner } from '@/hooks/handles/camera/OpenCamera';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, type FC } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ModalFiles } from '../modal/ModalFile';

type Props = {
  fileCount: number;
  recordID: number;
  token: string;
  userId: number;
  readOnly: boolean;
  moduleName: string;
  additional_styles?: object;
  onImageCaptured?: (uri: string) => void;
};

export const MediaActions: FC<Props> = (props) => {
  const [openFiles, setOpenFiles] = useState(false);
  const [openCamera, setOpenCamera] = useState(false); // Estado para controlar la cámara

  const handleCapture = (uri: string) => {
    if (props.onImageCaptured) {
      props.onImageCaptured(uri);
    }
    setOpenCamera(false);
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

        {props.fileCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{`${props.fileCount}`}</Text>
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
          onClose={() => setOpenCamera(false)}
          onCapture={handleCapture}
          recordId={props.recordID}
          moduleName={props.moduleName}
          token={props.token}
          userId={props.userId}
        />
      </Modal>

      {/* Modal para los archivos */}
      <ModalFiles
        visible={openFiles}
        onDismiss={() => setOpenFiles(false)}
        moduleName={props.moduleName}
        recordId={props.recordID}
        token={props.token}
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
