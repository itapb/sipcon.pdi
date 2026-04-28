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
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
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
  const [showDetails, setShowDetails] = useState(false);

  const [transporter, setTransporter] = useState<DataTransporter[]>([]);
  const [dealer, setDealer] = useState<DataDealer[]>([]);
  const [dealersVehicles, setDealersVehicles] = useState<
    DataInspectionDealers[]
  >([]);

  const [valueTransporter, setValueTransporter] = useState<number>(0);
  const [valueGeneralDealer, setValueGeneralDealer] = useState<number>(0);

  const selectedVehicles = useVehicleStore((state) => state.selectedVehicles);
  const clearSelection = useVehicleStore((state) => state.clearSelection);

  useEffect(() => {
    const GetData = async () => {
      setValueTransporter(0);
      setValueGeneralDealer(0);
      setShowDetails(false);

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
        if (rawVehicleDealers) setDealersVehicles(rawVehicleDealers);
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
      const hasDealerInDB =
        dealersVehicles.find((dv) => dv.inspectionId === v.vehicleId)
          ?.dealerId ?? 0;
      return hasDealerInDB > 0 || valueGeneralDealer > 0;
    });
  };

  const onSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert(
        'Validación',
        'Por favor seleccione el transportista y el concesionario general.',
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
        .map((res) => {
          const dealerFromDB =
            dealersVehicles.find((dv) => dv.inspectionId === res.id)
              ?.dealerId ?? 0;

          return {
            Id: res.id,
            CreatedBy: res.createdBy,
            AreaId: res.areaId,
            ClosedBy: props.userId,
            DClose: GetTime(),
            RecepBy: dealerFromDB > 0 ? dealerFromDB : valueGeneralDealer,
            TransporterId: valueTransporter,
            VehicleId: res.vehicleId,
            IsDispatch: true,
          };
        });

      if (inspectionsPayload.length === 0) throw new Error('Carga vacía');

      const r_post = await POST_Inspection({
        inspections: inspectionsPayload,
        token: props.token,
      });

      if (r_post === null) throw new Error('No se pudo procesar la petición');

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
              <Text style={styles.title}>Despacho de Lote</Text>
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
                  Sincronizando catálogos...
                </Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 500 }} bounces={false}>
                <View style={styles.innerContent}>
                  {/* Selector: Transportista */}
                  <View style={styles.containerLabel}>
                    <FontAwesome6
                      name='truck-front'
                      size={14}
                      color='#64748B'
                    />
                    <Text style={styles.label}>Transportista Responsable</Text>
                  </View>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={valueTransporter}
                      onValueChange={(val) => setValueTransporter(val)}
                      enabled={!isSubmitting}
                    >
                      <Picker.Item
                        label='Seleccionar transportista...'
                        value={0}
                        color='#94A3B8'
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

                  {/* Selector: Concesionario General */}
                  <View style={[styles.containerLabel, { marginTop: 16 }]}>
                    <MaterialCommunityIcons
                      name='store-cog'
                      size={16}
                      color='#64748B'
                    />
                    <Text style={styles.label}>Concesionario de Destino</Text>
                  </View>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={valueGeneralDealer}
                      onValueChange={(val) => setValueGeneralDealer(val)}
                      enabled={!isSubmitting}
                    >
                      <Picker.Item
                        label='Seleccionar destino general...'
                        value={0}
                        color='#94A3B8'
                      />
                      {dealer.map((d) => (
                        <Picker.Item key={d.id} label={d.name} value={d.id} />
                      ))}
                    </Picker>
                  </View>

                  <Divider style={styles.divider} />

                  {/* Sección Colapsable de Unidades */}
                  <TouchableOpacity
                    style={styles.collapseHeader}
                    onPress={() => setShowDetails(!showDetails)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <MaterialCommunityIcons
                        name='car-multiple'
                        size={20}
                        color='#475569'
                      />
                      <Text style={styles.collapseTitle}>
                        Ver Unidades ({selectedVehicles.length})
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name={showDetails ? 'chevron-up' : 'chevron-down'}
                      size={24}
                      color='#475569'
                    />
                  </TouchableOpacity>

                  {showDetails && (
                    <View style={styles.detailsContainer}>
                      {selectedVehicles.map((vehicle) => {
                        const dealerFromDB = dealersVehicles.find(
                          (dv) => dv.inspectionId === vehicle.vehicleId,
                        )?.dealerId;

                        return (
                          <View
                            key={vehicle.vehicleId}
                            style={styles.vehicleCard}
                          >
                            <View style={styles.vehicleCardHeader}>
                              <Text style={styles.vinText}>
                                VIN: {vehicle.vin}
                              </Text>
                              {!!dealerFromDB && (
                                <View style={styles.badge}>
                                  <Text style={styles.badgeText}>FIJO</Text>
                                </View>
                              )}
                            </View>
                            <Text style={styles.plateText}>
                              Placa: {vehicle.plate}
                            </Text>
                            <Text style={styles.statusText}>
                              Destino:{' '}
                              {!!dealerFromDB
                                ? dealer.find((d) => d.id === dealerFromDB)
                                    ?.name || 'Cargando...'
                                : valueGeneralDealer > 0
                                  ? dealer.find(
                                      (d) => d.id === valueGeneralDealer,
                                    )?.name
                                  : 'No asignado'}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              </ScrollView>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => props.onDismiss(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.btnTextCancel}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.btnConfirm,
                  (!isFormValid() || isSubmitting) && styles.btnDisabled,
                ]}
                onPress={onSubmit}
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color='white' size='small' />
                ) : (
                  <Text style={styles.btnTextConfirm}>Confirmar Despacho</Text>
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
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 12, color: '#64748B', fontSize: 14 },
  innerContent: { padding: 20 },
  containerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  label: { fontSize: 14, fontWeight: '600', color: '#475569' },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  divider: { marginVertical: 20, backgroundColor: '#F1F5F9', height: 1 },

  // Estilos del Colapsable
  collapseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  collapseTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  detailsContainer: { marginTop: 12, gap: 8 },
  vehicleCard: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
  },
  vehicleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  vinText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  plateText: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#0F172A' },
  badge: { backgroundColor: '#DCFCE7', paddingHorizontal: 6, borderRadius: 4 },
  badgeText: { fontSize: 10, color: '#166534', fontWeight: '900' },

  // Botones
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  btnCancel: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  btnConfirm: {
    flex: 2,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#22C55E',
  },
  btnDisabled: { backgroundColor: '#94A3B8' },
  btnTextCancel: { color: '#64748B', fontWeight: '700', fontSize: 15 },
  btnTextConfirm: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
