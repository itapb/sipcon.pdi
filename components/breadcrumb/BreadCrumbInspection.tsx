import { POST_InspectionFase } from '@/utils/fetchs/inspections/POST_InspectionFase';
import { GetTime } from '@/utils/GetTime';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useState, type FC } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ActionButton } from './ActionButton';

type Props = {
  inspectionId: number;
  InspectionFaseId: number;
  isItStarted: boolean;
  faseId: number;
  faseCompleted: boolean;
  userId: number;
};

export const BreadCrumbInspection: FC<Props> = ({
  isItStarted,
  InspectionFaseId,
  inspectionId,
  faseId,
  faseCompleted,
  userId,
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/'); // Ruta por defecto si no hay historial
    }
  };

  const handleInitInspection = () => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que desea iniciar esta inspección?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, iniciar',
          onPress: async () => {
            try {
              setLoading(true);
              const result = await POST_InspectionFase({
                Id: InspectionFaseId,
                FaseId: faseId,
                InspectionId: inspectionId,
                InitDate: GetTime(),
                UserInitId: userId,
              });

              if (!result.ok) {
                Alert.alert(
                  'Error al generar la inspección',
                  'Ocurrio un error al momento de crear la inspección',
                );

                return;
              }

              router.replace({
                pathname: pathname as any,
                params: { faseId: faseId },
              });
            } catch (error) {
              Alert.alert(
                'Error',
                `No se pudo iniciar la inspección. ${error}`,
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleCompletedFase = () => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que desea completar esta fase?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await POST_InspectionFase({
                Id: InspectionFaseId,
                FaseId: faseId,
                InspectionId: inspectionId,
                CompletedDate: GetTime(),
              });

              if (!response.ok) {
                Alert.alert(
                  'Error al generar la inspección',
                  'Ocurrio un error al momento de crear la inspección',
                );

                return;
              }

              if (response.data.lastId === -1) {
                Alert.alert(
                  'Inspecciones pendientes',
                  'Aún tienes caracteristicas por completar, por favor validar',
                );
              } else {
                router.replace({
                  pathname: pathname as any,
                  params: { faseId },
                });
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo completar la fase.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.breadCrumbs}>
      <Modal transparent visible={loading} animationType='fade'>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size='large' color='#0C8CE9' />
            <Text style={styles.loadingText}>Procesando...</Text>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={handleBack}
        style={styles.backButtonContainer}
        activeOpacity={0.6}
      >
        <MaterialCommunityIcons name='chevron-left' size={28} color='#64748B' />
        <Text style={styles.backText}>Regresar</Text>
      </TouchableOpacity>

      <ActionButton
        faseCompleted={faseCompleted}
        handleCompletedFase={handleCompletedFase}
        handleInitInspection={handleInitInspection}
        isItStarted={isItStarted}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  breadCrumbs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 55,
    backgroundColor: '#fff',
    borderColor: '#E2E8F0',
    borderBottomWidth: 1,
    zIndex: 10,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  backText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: -4,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  loadingText: {
    marginTop: 12,
    fontWeight: '700',
    color: '#1E293B',
    fontSize: 14,
  },
});
