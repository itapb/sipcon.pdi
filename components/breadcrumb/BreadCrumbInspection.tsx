import { POST_InspectionFase } from '@/utils/fetchs/inspections/POST_InspectionFase';
import { GetTime } from '@/utils/GetTime';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter, type Href } from 'expo-router';
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
  const pathname = usePathname() as Href;

  const handleBack = () => {
    router.canGoBack() ? router.back() : router.replace('/');
  };

  const executeFaseAction = async (
    message: string,
    payloadExtra: object,
    onDataCheck?: (data: any) => boolean,
  ) => {
    Alert.alert('Confirmación', message, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí',
        onPress: async () => {
          try {
            setLoading(true);
            const res = await POST_InspectionFase({
              Id: InspectionFaseId,
              FaseId: faseId,
              InspectionId: inspectionId,
              ...payloadExtra,
            });

            if (!res.ok) {
              return Alert.alert(
                'Error',
                'Ocurrió un error al procesar la fase.',
              );
            }

            if (onDataCheck && !onDataCheck(res.data)) return;

            router.replace({ pathname: pathname as any, params: { faseId } });
          } catch (e) {
            Alert.alert('Error', `Operación fallida. ${e}`);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleInitInspection = () =>
    executeFaseAction('¿Estás seguro de que desea iniciar esta inspección?', {
      InitDate: GetTime(),
      UserInitId: userId,
    });

  const handleCompletedFase = () =>
    executeFaseAction(
      '¿Estás seguro de que desea completar esta fase?',
      { CompletedDate: GetTime() },
      (data) => {
        if (data?.lastId === -1) {
          Alert.alert(
            'Inspecciones pendientes',
            'Aún tienes características por completar, por favor validar.',
          );
          return false;
        }
        return true;
      },
    );

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
        <MaterialCommunityIcons name='chevron-left' size={24} color='#64748B' />
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
    height: 48,
    backgroundColor: '#fff',
    borderColor: '#E2E8F0',
    borderBottomWidth: 1,
    zIndex: 10,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: -2,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  loadingText: {
    marginTop: 10,
    fontWeight: '600',
    color: '#1E293B',
    fontSize: 13,
  },
});
