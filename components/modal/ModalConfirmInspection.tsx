import { useVehicleStore } from '@/store/useVehicleStore';
import { GET_InspectionById } from '@/utils/fetchs/inspections/GET_InspectionById';
import { POST_Inspection } from '@/utils/fetchs/inspections/POST_Inspection';
import { GetTime } from '@/utils/GetTime';
import { useRouter } from 'expo-router';
import { useState, type FC } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Divider, Modal, Portal, Text } from 'react-native-paper';

type Props = {
  visible: boolean;
  onDismiss: (value: boolean) => void;
  token: string;
  userId: number;
};

export const ModalConfirmInspection: FC<Props> = (props) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedVehicles = useVehicleStore((state) => state.selectedVehicles);
  const clearSelection = useVehicleStore((state) => state.clearSelection);

  const onConfirm = async () => {
    setIsSubmitting(true);
    try {
      // 1. Obtenemos los datos actuales de cada inspección (los "results")
      const results = await Promise.all(
        selectedVehicles.map((v) =>
          GET_InspectionById({ inspectionId: v.vehicleId, token: props.token }),
        ),
      );

      // 2. Mapeamos conservando TODO lo que trae el objeto original (res)
      // y sobreescribiendo/añadiendo solo lo necesario para el cierre
      const inspectionsPayload = results
        .filter((res) => res !== null)
        .map((res) => ({
          Id: res.id,
          CreatedBy: res.createdBy,
          AreaId: res.areaId,
          ClosedBy: props.userId,
          DClose: GetTime(),
          VehicleId: res.vehicleId,
          IsDispatch: false,
        }));

      if (inspectionsPayload.length === 0)
        throw new Error('No hay datos para procesar');

      // 3. Enviamos el lote
      await POST_Inspection({
        inspections: inspectionsPayload,
        token: props.token,
      });

      Alert.alert(
        'Éxito',
        `${inspectionsPayload.length} unidades cerradas correctamente.`,
      );
      clearSelection();
      props.onDismiss(false);
      router.replace('/');
    } catch (error) {
      console.error('Error al cerrar lote:', error);
      Alert.alert('Error', 'No se pudo completar el cierre de la inspección.');
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
        <View style={styles.content}>
          <Text style={styles.title}>Confirmar Cierre de Lote</Text>
          <Divider style={styles.divider} />

          <Text style={styles.message}>
            Estás a punto de finalizar la inspección para:
          </Text>

          <View style={styles.badgeContainer}>
            <Text style={styles.countBadge}>
              {selectedVehicles.length} Unidades Seleccionadas
            </Text>
          </View>

          {/* Resumen simple de los items */}
          <View style={styles.itemsSummary}>
            {selectedVehicles.slice(0, 3).map((v) => (
              <Text key={v.vehicleId} style={styles.itemText}>
                • {v.plate} ({v.vin})
              </Text>
            ))}
            {selectedVehicles.length > 3 && (
              <Text style={styles.moreText}>
                ...y {selectedVehicles.length - 3} más
              </Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => props.onDismiss(false)}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelText}>Regresar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
              disabled={isSubmitting || selectedVehicles.length === 0}
            >
              {isSubmitting ? (
                <ActivityIndicator color='white' size='small' />
              ) : (
                <Text style={styles.confirmText}>Confirmar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    borderRadius: 12,
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  divider: {
    width: '100%',
    marginVertical: 15,
  },
  message: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 10,
  },
  badgeContainer: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 15,
  },
  countBadge: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 13,
  },
  itemsSummary: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  itemText: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 2,
  },
  moreText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  confirmButton: {
    backgroundColor: '#22C55E',
  },
  cancelText: {
    color: '#64748B',
    fontWeight: 'bold',
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
