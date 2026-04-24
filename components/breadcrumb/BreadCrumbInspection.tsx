import { POST_InspectionFase } from '@/utils/fetchs/inspections/POST_InspectionFase';
import { GetTime } from '@/utils/GetTime';
import { Link, usePathname, useRouter } from 'expo-router';
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

    return null;
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

      <View style={styles.breadCrumbsTexts}>
        <Link href={'/'} asChild>
          <TouchableOpacity>
            <Text style={styles.text}>Inicio {'> '}</Text>
          </TouchableOpacity>
        </Link>
        <Text style={[styles.text, styles.text_fase]}>Fase</Text>
      </View>

      {renderActionButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  breadCrumbs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 45,
    backgroundColor: '#fff',
    borderColor: '#E2E8F0',
    borderBottomWidth: 1,
    zIndex: 10,
  },
  breadCrumbsTexts: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#64748B',
    fontSize: 15,
  },
  text_fase: {
    color: '#0C8CE9',
    fontWeight: '700',
  },
  button: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  red: {
    backgroundColor: '#FF383C',
  },
  green: {
    backgroundColor: '#22C55E',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    fontWeight: '600',
    color: '#334155',
  },
});
