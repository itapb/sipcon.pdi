import { useInspectionStore } from '@/store/useInspectionStore';
import { POST_FullInspection } from '@/utils/fetchs/inspections/POST_FullInspection';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, type FC } from 'react';
import {
  ActivityIndicator,
  Alert,
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

type Props = {
  userId: number;
  visible: boolean;
  onDismiss: (value: boolean) => void;
  token: string;
  areaId: number;
};

export const ModalInspection: FC<Props> = (props) => {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const setNeedsRefresh = useInspectionStore((state) => state.setNeedsRefresh);

  const SubmitFullInspection = async () => {
    if (!value.trim()) return;

    setIsLoading(true);
    try {
      const result = await POST_FullInspection({
        Identifier: value,
        AreaId: props.areaId,
        token: props.token,
        userId: props.userId,
      });

      if (result?.insertedRows === 0 && result?.lastId === 0) {
        Alert.alert(
          'Unidad no encontrada',
          'El VIN/Placa no existe o no tiene una inspección pendiente en esta área.',
          [{ text: 'Entendido', style: 'default' }],
        );

        setValue('');
        props.onDismiss(false);
        return;
      }

      setNeedsRefresh(true);
      router.replace(`/`);

      console.log({ result });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={props.visible}
        onDismiss={() => !isLoading && props.onDismiss(false)} // Evita cerrar mientras carga
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
                onPress={() => props.onDismiss(false)}
                style={styles.closeButton}
                disabled={isLoading} // Desactivar si está cargando
              />
            </View>

            {/* Contenido del modal */}
            <View style={styles.innerContent}>
              <View style={styles.containerLabel}>
                <Ionicons name='car-sharp' size={30} color='#666' />
                <Text style={styles.label}>VIN o PLACA:</Text>
              </View>

              <TextInput
                style={[styles.input, isLoading && { opacity: 0.5 }]}
                placeholder='INGRESE VIN O PLACA...'
                placeholderTextColor={'#999'}
                value={value}
                onChangeText={(text) => setValue(text.toUpperCase())}
                autoCapitalize='characters'
                autoCorrect={false}
                editable={!isLoading} // Bloquear input durante la carga
              />
            </View>

            {/* Botones de acción */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.7}
                onPress={() => props.onDismiss(false)}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.green,
                  isLoading && styles.disabledButton,
                ]}
                activeOpacity={0.7}
                onPress={SubmitFullInspection}
                disabled={isLoading} // Evita múltiples clics
              >
                {isLoading ? (
                  <ActivityIndicator color='white' size='small' />
                ) : (
                  <>
                    <FontAwesome6 name='add' size={20} color='white' />
                    <Text style={[styles.buttonText, styles.white]}>Crear</Text>
                  </>
                )}
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
    marginHorizontal: 20,
    borderRadius: 20,
    paddingBottom: 10,
    elevation: 10,
    overflow: 'hidden',
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
  disabledButton: {
    backgroundColor: '#86EFAC', // Un verde más claro cuando carga
    borderColor: '#86EFAC',
  },
  white: {
    color: 'white',
  },
});
