import { OpenGallery } from '@/hooks/handles/OpenGallery';
import { Entypo, Feather } from '@expo/vector-icons';
import type { FC, ReactNode } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconButton, Modal, Portal, Text } from 'react-native-paper';

// Obtenemos la altura para calcular el 50%
const { height } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onDismiss: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  children?: ReactNode;
};

export const ModalFiles: FC<Props> = ({ visible, onDismiss }) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => onDismiss(false)}
        contentContainerStyle={styles.modalContainer}
      >
        {/* Cabecera del modal */}
        <View style={styles.header}>
          <Text style={styles.title}>Datos Adjuntos</Text>
          <IconButton
            icon='close'
            size={20}
            onPress={() => onDismiss(false)}
            style={styles.closeButton}
          />
        </View>

        {/* Contenido del modal */}
        <ScrollView
          style={styles.scrollWrapper}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={true}
        >
          {Array(50)
            .fill(0)
            .map((_, _i) => (
              <CardFile key={_i} />
            ))}
        </ScrollView>

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button]}
            activeOpacity={0.7}
            onPress={() => onDismiss(false)}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.blue]}
            activeOpacity={0.7}
            onPress={OpenGallery}
          >
            <Entypo name='attachment' size={24} color='white' />

            <Text style={[styles.buttonText, styles.white]}>Adjuntar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Portal>
  );
};

const CardFile: FC = () => {
  return (
    <View style={styles.cardItem}>
      {/* Detalles del archivo */}
      <View>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          Nombre del archivo.jpg
        </Text>
        <Text style={{ fontSize: 13, color: '94A3B8' }}>12.2 MB</Text>
      </View>

      {/* Barra de opciones */}
      <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
        <Feather name='download' size={27} color='#94A3B8' />
        <Feather name='trash-2' size={27} color='#94A3B8' />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: height * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  closeButton: {
    margin: 0,
  },
  scrollWrapper: {
    width: '100%',
  },
  content: {
    padding: 20,
  },
  cardItem: {
    width: '98%',
    height: 100,
    backgroundColor: '#F8FAFC',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  button: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buttonText: {
    color: '',
    fontWeight: '700',
    fontSize: 13,
    borderRadius: 10,
  },
  blue: {
    backgroundColor: '#0C8CE9',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  white: {
    color: 'white',
    fontWeight: 'bold',
  },
});
