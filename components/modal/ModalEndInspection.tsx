import { useVehicleStore } from '@/store/useVehicleStore';
import { DataDealer, GET_Dealer } from '@/utils/fetchs/dealer/GET_Dealer';
import { GET_InspectionById } from '@/utils/fetchs/inspections/GET_InspectionById';
import { POST_Inspection } from '@/utils/fetchs/inspections/POST_Inspection';
import {
  DataTransporter,
  GET_Transporter,
} from '@/utils/fetchs/transporter/GET_Transporter';
import { GetTime } from '@/utils/GetTime';
import { FontAwesome6 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState, type FC } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
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

// TODO: Separar logica, está muy complejo
export const ModalEndInspection: FC<Props> = (props) => {
  // --- Estados locales ---
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transporter, setTransporter] = useState<DataTransporter[]>([]);
  const [dealer, setDealer] = useState<DataDealer[]>([]);
  const [valueTransporter, setValueTransporter] = useState<number>(0);
  const [valueDealer, setValueDealer] = useState<number>(0);

  // --- Store (Zustand) ---
  const selectedVehicles = useVehicleStore((state) => state.selectedVehicles);
  const clearSelection = useVehicleStore((state) => state.clearSelection);

  // --- Carga de datos maestros (Catálogos) ---
  useEffect(() => {
    const GetData = async () => {
      setIsLoading(true);
      try {
        const [rawTransporter, rawDealer] = await Promise.all([
          GET_Transporter({ token: props.token }),
          GET_Dealer({ token: props.token, supplierId: 4069 }),
        ]);

        if (rawTransporter) setTransporter(rawTransporter);
        if (rawDealer) setDealer(rawDealer);
      } catch (error) {
        console.error('Error al cargar catálogos:', error);
        Alert.alert(
          'Error',
          'No se pudieron cargar los transportistas o concesionarios.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (props.visible) {
      GetData();
    }
  }, [props.visible]);

  // --- Proceso de finalización masiva ---
  const onSubmit = async () => {
    if (valueDealer === 0 || valueTransporter === 0) {
      Alert.alert(
        'Validación',
        'Por favor seleccione transportista y concesionario.',
      );
      return;
    }

    if (selectedVehicles.length === 0) {
      Alert.alert(
        'Validación',
        'No hay unidades seleccionadas para finalizar.',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Mapeamos los IDs seleccionados a promesas de obtención de detalle y luego posteo
      const promises = selectedVehicles.map(async (inspectionId) => {
        const result = await GET_InspectionById({
          inspectionId,
          token: props.token,
        });

        if (!result)
          throw new Error(`Inspección ${inspectionId} no encontrada.`);

        return await POST_Inspection({
          Id: result.id,
          token: props.token,
          CreatedBy: result.createdBy,
          AreaId: result.areaId,
          ClosedBy: props.userId,
          DClose: GetTime(),
          RecepBy: valueDealer,
          TransporterId: valueTransporter,
          VehicleId: result.vehicleId,
        });
      });

      // 2. Ejecutamos todas las peticiones en paralelo
      await Promise.all(promises);

      Alert.alert(
        'Éxito',
        `${selectedVehicles.length} unidades procesadas correctamente.`,
      );

      // 3. Limpieza de estados y refresco de vista principal
      clearSelection();
      props.onDismiss(false);
    } catch (error) {
      console.error('Error en proceso masivo:', error);
      Alert.alert(
        'Error',
        'Ocurrió un fallo al finalizar el lote. Verifique su conexión.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={props.visible}
        onDismiss={() => !isSubmitting && props.onDismiss(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            {/* Cabecera */}
            <View style={styles.header}>
              <Text style={styles.title}>Finalizar Inspección</Text>
              <IconButton
                icon='close'
                size={20}
                onPress={() => props.onDismiss(false)}
                disabled={isSubmitting}
              />
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#22C55E' />
                <Text style={styles.loadingText}>Cargando catálogos...</Text>
              </View>
            ) : (
              <View style={styles.innerContent}>
                {/* Retroalimentación: Resumen de selección */}
                <View style={styles.summaryBadge}>
                  <FontAwesome6 name='car-side' size={16} color='#475569' />
                  <Text style={styles.summaryText}>
                    Se finalizarán{' '}
                    <Text style={styles.boldText}>
                      {selectedVehicles.length}
                    </Text>{' '}
                    unidades seleccionadas.
                  </Text>
                </View>

                {/* Selector de Transportista */}
                <View style={styles.containerLabel}>
                  <FontAwesome6 name='truck-front' size={18} color='#666' />
                  <Text style={styles.label}>Transportista:</Text>
                </View>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={valueTransporter}
                    onValueChange={(val) => setValueTransporter(val)}
                    enabled={!isSubmitting}
                    style={{ width: '100%', color: '#000' }}
                    dropdownIconColor='#FFF'
                  >
                    <Picker.Item
                      label='Seleccione transportista...'
                      value={0}
                      color='#999'
                    />
                    {transporter.map((item) => (
                      <Picker.Item
                        style={{
                          color: '#000',
                          backgroundColor: 'transparent',
                        }}
                        key={item.id}
                        label={item.firstName}
                        value={item.id}
                      />
                    ))}
                  </Picker>
                </View>

                {/* Selector de Concesionario */}
                <View style={[styles.containerLabel, { marginTop: 15 }]}>
                  <FontAwesome6 name='shop' size={18} color='#666' />
                  <Text style={styles.label}>Concesionario:</Text>
                </View>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={valueDealer}
                    onValueChange={(val) => setValueDealer(val)}
                    enabled={!isSubmitting}
                    style={{ width: '100%', color: '#000' }}
                    dropdownIconColor='#FFF'
                  >
                    <Picker.Item
                      label='Seleccione concesionario...'
                      value={0}
                      color='#999'
                    />
                    {dealer.map((item) => (
                      <Picker.Item
                        style={{
                          color: '#000',
                          backgroundColor: 'transparent',
                        }}
                        key={item.id}
                        label={`${item.reference} - ${item.name}`}
                        value={item.id}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}

            {/* Botones de acción */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => props.onDismiss(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.green,
                  (isSubmitting ||
                    valueDealer === 0 ||
                    valueTransporter === 0) &&
                    styles.disabledButton,
                ]}
                onPress={onSubmit}
                disabled={
                  isSubmitting || valueDealer === 0 || valueTransporter === 0
                }
              >
                {isSubmitting ? (
                  <ActivityIndicator color='white' size='small' />
                ) : (
                  <>
                    <FontAwesome6 name='check-double' size={18} color='white' />
                    <Text style={[styles.buttonText, styles.white]}>
                      Confirmar Lote
                    </Text>
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
  loadingContainer: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontWeight: '500',
  },
  innerContent: {
    paddingVertical: 15,
  },
  summaryBadge: {
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryText: {
    color: '#475569',
    fontSize: 13,
    flex: 1,
  },
  boldText: {
    fontWeight: '900',
    color: '#1E293B',
  },
  containerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '700',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 145,
    height: 48,
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
    backgroundColor: '#86EFAC',
    borderColor: '#86EFAC',
    opacity: 0.8,
  },
  white: {
    color: 'white',
  },
});
