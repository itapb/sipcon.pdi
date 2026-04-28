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

type Props = {
  inspectionId: number;
  InspectionFaseId: number;
  isItStarted: boolean;
  token: string;
  faseId: number;
  faseCompleted: boolean;
  userId: number;
};

export const BreadCrumbInspection: FC<Props> = ({
  isItStarted,
  InspectionFaseId,
  token,
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
              await POST_InspectionFase({
                Id: InspectionFaseId,
                FaseId: faseId,
                InspectionId: inspectionId,
                token,
                InitDate: GetTime(),
                UserInitId: userId,
              });

              router.replace({
                pathname: pathname as any,
                params: { faseId: faseId },
              });
            } catch (error) {
              Alert.alert('Error', 'No se pudo iniciar la inspección.');
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
              await POST_InspectionFase({
                Id: InspectionFaseId,
                FaseId: faseId,
                InspectionId: inspectionId,
                token,
                CompletedDate: GetTime(),
              });

              router.replace({
                pathname: pathname as any,
                params: { faseId },
              });
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

  const renderActionButton = () => {
    if (!isItStarted) {
      return (
        <TouchableOpacity
          style={[styles.button, styles.green]}
          activeOpacity={0.7}
          onPress={handleInitInspection}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Iniciar Fase</Text>
        </TouchableOpacity>
      );
    }

    if (!faseCompleted) {
      return (
        <TouchableOpacity
          style={[styles.button, styles.red]}
          activeOpacity={0.7}
          onPress={handleCompletedFase}
        >
          <Text style={styles.buttonText}>Cerrar Fase</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.completedBadge}>
        <MaterialCommunityIcons
          name='check-decagram'
          size={16}
          color='#22C55E'
        />
        <Text style={styles.completedText}>Finalizada</Text>
      </View>
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

      {renderActionButton()}
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
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
    textTransform: 'uppercase',
  },
  red: {
    backgroundColor: '#EF4444',
  },
  green: {
    backgroundColor: '#22C55E',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  completedText: {
    color: '#166534',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 4,
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
