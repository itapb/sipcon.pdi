import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import type { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  fileCount: number;
  additional_styles?: object;
};

export const MediaActions: FC<Props> = (props) => {
  return (
    <View style={[styles.iconsRow, props.additional_styles]}>
      {/* Icono de la cámara */}
      <MaterialCommunityIcons
        name='camera-outline'
        size={30}
        color='#B0BEC5'
        style={styles.iconCamera}
      />

      {/* Icono de la carpeta */}
      <View style={styles.folderContainer}>
        <FontAwesome5 name='folder' size={28} color='#B0BEC5' />

        {props.fileCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{`${props.fileCount}`}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconsRow: {
    flexDirection: 'row',
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
    borderRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
