import { useVehicleStore } from '@/store/useVehicleStore';
import { DataDealer, GET_Dealer } from '@/utils/fetchs/dealer/GET_Dealer';
import {
  DataInspectionDealers,
  GET_InpectionDealers,
} from '@/utils/fetchs/inspections/GET_InpectionDealers';
import { GET_InspectionById } from '@/utils/fetchs/inspections/GET_InspectionById';
import { POST_Inspection } from '@/utils/fetchs/inspections/POST_Inspection';
import {
  DataTransporter,
  GET_Transporter,
} from '@/utils/fetchs/transporter/GET_Transporter';
import { GetTime } from '@/utils/GetTime';
import { FontAwesome6 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState, type FC } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Divider, IconButton, Modal, Portal, Text } from 'react-native-paper';

type Props = {
  userId: number;
  visible: boolean;
  onDismiss: (value: boolean) => void;
  token: string;
  areaId: number;
  supplierId: number;
};

export const ModalEndInspection: FC<Props> = (props) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transporter, setTransporter] = useState<DataTransporter[]>([]);
  const [dealer, setDealer] = useState<DataDealer[]>([]);
  const [dealersVehicles, setDealersVehicles] = useState<
    DataInspectionDealers[]
  >([]);

  const [valueTransporter, setValueTransporter] = useState<number>(0);
  const [selectedDealersMap, setSelectedDealersMap] = useState<
    Record<number, number>
  >({});

  const selectedVehicles = useVehicleStore((state) => state.selectedVehicles);
  const clearSelection = useVehicleStore((state) => state.clearSelection);

  useEffect(() => {
    const GetData = async () => {
      // Reinicio de estados al abrir
      setValueTransporter(0);
      setSelectedDealersMap({});

      setIsLoading(true);
      try {
        const ids = selectedVehicles.map((item) => item.vehicleId);

        const [rawTransporter, rawDealer, rawVehicleDealers] =
          await Promise.all([
            GET_Transporter({ token: props.token }),
            GET_Dealer({ token: props.token, supplierId: props.supplierId }),
            GET_InpectionDealers({ token: props.token, inspectionIds: ids }),
          ]);

        if (rawTransporter) setTransporter(rawTransporter);
        if (rawDealer) setDealer(rawDealer);

        if (rawVehicleDealers) {
          setDealersVehicles(rawVehicleDealers);

          // SOLUCIÓN: Precarga del diccionario para evitar undefined en el POST
          const initialMap: Record<number, number> = {};
          rawVehicleDealers.forEach((item) => {
            if (item.dealerId > 0) {
              // Usamos inspectionId como llave para coincidir con el mapeo del POST
              initialMap[item.inspectionId] = item.dealerId;
            }
          });
          setSelectedDealersMap(initialMap);
        }
      } catch (error) {
        console.error('Error al cargar catálogos:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos iniciales.');
      } finally {
        setIsLoading(false);
      }
    };

    if (props.visible) GetData();
  }, [props.visible]);

  const isFormValid = () => {
    if (valueTransporter === 0) return false;
    if (selectedVehicles.length === 0) return false;

    return selectedVehicles.every((v) => {
      // Validamos que exista un valor mayor a 0 en el mapa (ya sea precargado o manual)
      return (
        selectedDealersMap[v.vehicleId] && selectedDealersMap[v.vehicleId] > 0
      );
    });
  };

  const handleDealerChange = (vehicleId: number, dealerId: number) => {
    setSelectedDealersMap((prev) => ({
      ...prev,
      [vehicleId]: dealerId,
    }));
  };

  const onSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert(
        'Validación',
        'Por favor complete todos los datos requeridos.',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const results = await Promise.all(
        selectedVehicles.map((v) =>
          GET_InspectionById({ inspectionId: v.vehicleId, token: props.token }),
        ),
      );

      const inspectionsPayload = results
        .filter((res) => res !== null)
        .map((res) => ({
          Id: res.id,
          CreatedBy: res.createdBy,
          AreaId: res.areaId,
          ClosedBy: props.userId,
          DClose: GetTime(),
          // Ahora siempre está poblado por el useEffect o el picker manual
          RecepBy: selectedDealersMap[res.id] || 0,
          TransporterId: valueTransporter,
          VehicleId: res.vehicleId,
          IsDispatch: true,
        }));

      if (inspectionsPayload.length === 0) throw new Error('Carga vacía');

      await POST_Inspection({
        inspections: inspectionsPayload,
        token: props.token,
      });

      Alert.alert('Éxito', `${inspectionsPayload.length} unidades procesadas.`);
      clearSelection();
      props.onDismiss(false);
      router.replace('/');
    } catch (error) {
      console.error('Error POST:', error);
      Alert.alert('Error', 'Ocurrió un error al procesar el lote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!props.visible) return null;

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
          >
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
                <Text style={styles.loadingText}>
                  Sincronizando unidades...
                </Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 400 }}>
                <View style={styles.innerContent}>
                  {/* Transportista General */}
                  <View style={styles.containerLabel}>
                    <FontAwesome6 name='truck-front' size={16} color='#666' />
                    <Text style={styles.label}>Transportista General:</Text>
                  </View>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={valueTransporter}
                      onValueChange={(val) => setValueTransporter(val)}
                      enabled={!isSubmitting}
                    >
                      <Picker.Item
                        label='Seleccione transportista...'
                        value={0}
                        color='#999'
                      />
                      {transporter.map((t) => (
                        <Picker.Item
                          key={t.id}
                          label={t.firstName}
                          value={t.id}
                        />
                      ))}
                    </Picker>
                  </View>

                  <Divider
                    style={{ marginVertical: 20, marginHorizontal: 20 }}
                  />

                  <Text
                    style={[
                      styles.label,
                      { paddingHorizontal: 20, marginBottom: 10 },
                    ]}
                  >
                    Asignar Destinos ({selectedVehicles.length})
                  </Text>

                  {selectedVehicles.map((vehicle) => {
                    // Verificamos si la unidad ya tenía dealer en la BD
                    const dealerFromDB = dealersVehicles.find(
                      (dv) => dv.inspectionId === vehicle.vehicleId,
                    )?.dealerId;

                    const currentDealerId =
                      selectedDealersMap[vehicle.vehicleId] || 0;
                    const isReadOnly = !!dealerFromDB || isSubmitting;

                    return (
                      <View
                        key={vehicle.vehicleId}
                        style={styles.vehicleAssignmentCard}
                      >
                        <Text style={styles.vehicleInfoText}>
                          Placa : {vehicle.plate} | VIN: {vehicle.vin}
                          {!!dealerFromDB && (
                            <Text style={{ color: '#22C55E' }}>
                              {' '}
                              (Destino pre-establecido)
                            </Text>
                          )}
                        </Text>
                        <View
                          style={[
                            styles.pickerWrapperSmall,
                            isReadOnly && { backgroundColor: '#F1F5F9' },
                          ]}
                        >
                          <Picker
                            selectedValue={currentDealerId}
                            onValueChange={(val) =>
                              handleDealerChange(vehicle.vehicleId, val)
                            }
                            enabled={!isReadOnly}
                            style={{ color: isReadOnly ? '#64748B' : '#000' }}
                          >
                            <Picker.Item
                              label='Seleccionar destino...'
                              value={0}
                              color='#999'
                            />
                            {dealer.map((d) => (
                              <Picker.Item
                                key={d.id}
                                label={d.name}
                                value={d.id}
                              />
                            ))}
                          </Picker>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            )}

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
                  (!isFormValid() || isSubmitting) && styles.disabledButton,
                ]}
                onPress={onSubmit}
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color='white' />
                ) : (
                  <Text style={styles.buttonTextWhite}>Confirmar Lote</Text>
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
    borderRadius: 15,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 10, color: '#666', fontWeight: '500' },
  innerContent: { paddingVertical: 10 },
  containerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  label: { fontSize: 13, fontWeight: '700', color: '#475569' },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    width: '90%',
    alignSelf: 'center',
  },
  vehicleAssignmentCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 8,
  },
  vehicleInfoText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 5,
  },
  pickerWrapperSmall: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    height: 45,
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  button: {
    borderRadius: 8,
    height: 45,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buttonText: { fontWeight: 'bold', color: '#64748B' },
  buttonTextWhite: { fontWeight: 'bold', color: 'white' },
  green: { backgroundColor: '#22C55E', borderColor: '#16A34A' },
  disabledButton: { backgroundColor: '#CCC', borderColor: '#CCC' },
});
