import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useState, type FC } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { IconButton, Modal, Portal, Text } from 'react-native-paper';

const { height } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onDismiss: (value: boolean) => void;
};

export const ModalInspection: FC<Props> = ({ visible, onDismiss }) => {
  const [value, setValue] = useState('');

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => onDismiss(false)}
        // El estilo del contenedor ahora lo centra automáticamente
        contentContainerStyle={styles.modalContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            {/* Cabecera del modal */}
            <View style={styles.header}>
              <Text style={styles.title}>Agregando Inspección</Text>
              <IconButton
                icon='close'
                size={20}
                onPress={() => onDismiss(false)}
                style={styles.closeButton}
              />
            </View>

            {/* Contenido del modal */}
            <View style={styles.innerContent}>
              <View style={styles.containerLabel}>
                <Ionicons name='car-sharp' size={30} color='#666' />
                <Text style={styles.label}>VIN o PLACA:</Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder='INGRESE VIN O PLACA...'
                placeholderTextColor={'#999'}
                value={value}
                onChangeText={(text) => setValue(text.toUpperCase())}
                autoCapitalize='characters'
                autoCorrect={false}
              />
            </View>

            {/* Botones de acción */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.7}
                onPress={() => onDismiss(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.green]}
                activeOpacity={0.7}
              >
                <FontAwesome6 name='add' size={20} color='white' />
                <Text style={[styles.buttonText, styles.white]}>Crear</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    // Centrado: Eliminamos position absolute bottom/left/right
    marginHorizontal: 20,
    borderRadius: 20, // Bordes redondeados en todas las esquinas
    paddingBottom: 10,
    elevation: 10,
    overflow: 'hidden', // Asegura que el contenido respete los bordes
  },
  keyboardView: {
    width: '100%',
  },
  innerContent: {
    paddingVertical: 20,
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
  containerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fafafa',
    color: '#333',
    width: '90%',
    alignSelf: 'center',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 45,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buttonText: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 14,
  },
  green: {
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    gap: 8,
    borderColor: '#16A34A',
  },
  white: {
    color: 'white',
  },
});
