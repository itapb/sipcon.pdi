import { OpenCamera } from '@/utils/handles/OpenCamera';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, type FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ModalFiles } from '../modal/ModalFile';

type Props = {
  fileCount: number;
  additional_styles?: object;
  onImageCaptured?: (uri: string) => void;
};

export const MediaActions: FC<Props> = (props) => {
  const [OpenModal, setOpenModal] = useState(false);

  return (
    <View style={[styles.iconsRow, props.additional_styles]}>
      {/* Botón Cámara: Toma foto y cierra */}
      <TouchableOpacity onPress={OpenCamera} activeOpacity={0.6}>
        <MaterialCommunityIcons
          name='camera-outline'
          size={30}
          color='#B0BEC5'
          style={styles.iconCamera}
        />
      </TouchableOpacity>

      {/* Icono de la carpeta */}
      <TouchableOpacity
        onPress={() => setOpenModal(true)}
        style={styles.folderContainer}
        activeOpacity={0.6}
      >
        <FontAwesome5 name='folder' size={28} color='#B0BEC5' />

        {props.fileCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{`${props.fileCount}`}</Text>
          </View>
        )}

        {/* Modal para los archivos */}
        <ModalFiles visible={OpenModal} onDismiss={setOpenModal} />
      </TouchableOpacity>
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
