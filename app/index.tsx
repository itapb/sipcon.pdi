import { HomeContent } from '@/components/home/HomeContent';
import { useAuthStore } from '@/store/useAuthStore';
import { useVehicleStore } from '@/store/useVehicleStore';
import { GET_InspectionsFases } from '@/utils/fetchs/inspections/GET_InspectionFase';
import {
  DataInspection,
  GET_Inspections,
} from '@/utils/fetchs/inspections/GET_Inspections';
import {
  GroupInspectionsFase,
  T_GroupInspectionsFase,
} from '@/utils/GroupInspectionsByFase';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

type FetchProps = {
  areaId: number;
};

export default function HomeScreen() {
  const router = useRouter();
  const { faseId = '0' as any } = useLocalSearchParams();

  // Conexión a Stores globales
  const ClearSelection = useVehicleStore((state) => state.clearSelection);
  const { user, isLoggedIn, areas, selectedArea, selectedSupplier, logout } =
    useAuthStore();

  // Estados locales de la data de inspección
  const [fases, setFases] = useState<T_GroupInspectionsFase[] | null>(null);
  const [inspections, setInspections] = useState<DataInspection[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función dedicada a expulsar al usuario si expiró el token
  const handleUnauthorized = useCallback(() => {
    setFases(null);
    setInspections(null);

    Alert.alert(
      'Sesión Expirada',
      'Tu sesión ha caducado por motivos de seguridad. Por favor, inicia sesión nuevamente.',
      [
        {
          text: 'Aceptar',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ],
      { cancelable: false },
    );
  }, [router, logout]);

  // Función asíncrona de consulta
  const GetInfoPage = useCallback(
    async (props: FetchProps) => {
      if (!user?.token) return;

      setLoading(true);
      setError(null);

      try {
        const [resFases, resInspections] = await Promise.all([
          GET_InspectionsFases({
            areaId: props.areaId,
            token: user.token,
            Completed: false,
          }),
          GET_Inspections({
            areaId: props.areaId,
            token: user.token,
            isCompleted: false,
          }),
        ]);

        if (resFases.status === 401 || resInspections.status === 401) {
          handleUnauthorized();
          return;
        }

        if (!resFases.ok || !resInspections.ok) {
          setError(
            'Error al momento de solicitar las fases o las inspecciones',
          );
          setFases(null);
          setInspections(null);
          return;
        }

        const dataFase = resFases.data;
        const dataInspection = resInspections.data;

        setFases(dataFase.length ? GroupInspectionsFase(dataFase) : []);
        setInspections(dataInspection);
      } catch (err) {
        console.error('Error obteniendo datos:', err);
        setError('No se pudieron cargar los datos de inspección');
      } finally {
        setLoading(false);
      }
    },
    [user?.token, handleUnauthorized],
  );

  // Control del ciclo de vida y foco de pantalla
  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn && selectedArea && user?.token) {
        GetInfoPage({ areaId: selectedArea });
        ClearSelection();
      }
    }, [isLoggedIn, selectedArea, user?.token, ClearSelection, GetInfoPage]),
  );

  const ManualRefresh = () => {
    if (selectedArea) {
      GetInfoPage({ areaId: selectedArea });
    }
  };

  // Le pasamos absolutamente toda la información recolectada al componente visual
  return (
    <HomeContent
      faseId={faseId}
      fases={fases}
      inspections={inspections}
      loading={loading}
      error={error}
      areas={areas}
      selectedArea={selectedArea}
      selectedSupplier={selectedSupplier}
      user={user}
      ManualRefresh={ManualRefresh}
    />
  );
}
