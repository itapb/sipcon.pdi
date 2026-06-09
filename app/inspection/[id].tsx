import { InspectionContent } from '@/components/inspection/InspectionContent';
import { useAuthStore } from '@/store/useAuthStore';
import {
  DataInspectionById,
  GET_InspectionById,
} from '@/utils/fetchs/inspections/GET_InspectionById';
import {
  DataInspectionDetail,
  GET_InspectionDetails,
} from '@/utils/fetchs/inspections/GET_InspectionDetailt';
import {
  DataInspectionFase,
  GET_InspectionsFases,
} from '@/utils/fetchs/inspections/GET_InspectionFase';
import { GroupFeaturesByType } from '@/utils/GroupFeaturesByType';
import {
  inspectionEventEmitter,
  TRIGGER_REFRESH_EVENT,
} from '@/utils/inspectionEvents';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

type Props = {
  inspectionId: number;
  faseId: number;
};

export default function InspectionScreen() {
  const router = useRouter();

  // Tipado seguro de parámetros de ruta desde Expo Router
  const { id, faseId } = useLocalSearchParams<{ id: string; faseId: string }>();
  const { user, isLoggedIn, areas, logout } = useAuthStore();

  // --- Estados de Control
  const [load, setLoad] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para contener la información
  const [observation, setObservation] = useState<string>('');
  const [showObservation, setShowObservation] = useState<boolean>(false);
  const [inspection, setInspection] = useState<DataInspectionById | null>(null);
  const [inspectionDetail, setInspectionDetail] = useState<
    DataInspectionDetail[]
  >([]);
  const [inspectionFase, setInspectionFase] = useState<DataInspectionFase[]>(
    [],
  );

  // MUTACIÓN LOCAL DIRECTA CON TIPADO SEGURO
  const handleUpdateQuestionLocal = useCallback(
    (idDetail: number, newValue: number | null, newObs: string) => {
      setInspectionDetail((prev) =>
        prev.map((item): DataInspectionDetail => {
          if (item.id === idDetail) {
            return {
              ...item,
              value: newValue as any,
              observation: newObs,
            };
          }
          return item;
        }),
      );
    },
    [],
  );

  const handleUnauthorized = useCallback(() => {
    setInspection(null);
    setInspectionDetail([]);
    setInspectionFase([]);
    Alert.alert(
      'Sesión Expirada',
      'Tu sesión ha caducado. Por favor, inicia sesión nuevamente.',
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

  // Función para obtener la información
  const GetInfoPageInspection = useCallback(
    async (props: Props) => {
      setLoad(true);
      setError(null);

      try {
        // 1. Ejecutamos las peticiones concurrentes
        const [resDetail, resFases, resInspection] = await Promise.all([
          GET_InspectionDetails({
            inspectionId: props.inspectionId,
            faseId: props.faseId,
          }),
          GET_InspectionsFases({
            inspectionId: props.inspectionId,
            Completed: false,
          }),
          GET_InspectionById({
            inspectionId: props.inspectionId,
          }),
        ]);

        // 2. Control de sesión expirada unificado
        if (
          resDetail.status === 401 ||
          resFases.status === 401 ||
          resInspection.status === 401
        ) {
          handleUnauthorized();
          return;
        }

        // 3. Extracción de datos defensiva evaluando el flag .ok

        setInspection((prev) => (resInspection.ok ? resInspection.data : prev));
        setInspectionDetail((prev) => (resDetail.ok ? resDetail.data : prev));
        setInspectionFase((prev) => (resFases.ok ? resFases.data : prev));

        if (resInspection.ok && resInspection.data?.comment !== undefined) {
          setObservation(resInspection.data.comment ?? '');
        }

        // Si alguna petición crítica falló sin ser 401, guardamos el aviso
        if (!resDetail.ok || !resFases.ok || !resInspection.ok) {
          setError('Algunos datos no se pudieron sincronizar por completo.');
        }
      } catch (err) {
        console.error(`Error obteniendo detalles de inspección: ${err}`);
        setError(
          'No se pudo conectar con el servidor para traer la inspección.',
        );
      } finally {
        setLoad(false);
      }
    },
    [handleUnauthorized],
  );

  // ESCUCHADOR DE EVENTO GLOBAL
  useEffect(() => {
    const subscription = inspectionEventEmitter.addListener(
      TRIGGER_REFRESH_EVENT,
      () => {
        if (id && faseId) {
          GetInfoPageInspection({ inspectionId: +id, faseId: +faseId });
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [id, faseId, GetInfoPageInspection]);

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn && id && faseId) {
        GetInfoPageInspection({ inspectionId: +id, faseId: +faseId });
      }
    }, [isLoggedIn, id, faseId, GetInfoPageInspection]),
  );

  // Re-calcula de forma óptima los grupos cuando inspectionDetail muta localmente
  const groups = useMemo(() => {
    return GroupFeaturesByType(inspectionDetail);
  }, [inspectionDetail]);

  // Es para mostrar la fase que quiero filtrar en la pagina principal
  const activedFase = useMemo(() => {
    if (!id || !faseId) return null;
    return inspectionFase.find(
      (item) => item.faseId === +faseId && item.inspectionId === +id,
    );
  }, [inspectionFase, id, faseId]);

  // Validar si el usuario tiene permisos para editar esa inspección
  const hasPermission = useMemo(() => {
    if (!activedFase) return false;
    return areas?.some((item) => item.id === activedFase.faseId) ?? false;
  }, [areas, activedFase]);

  // Validamos el usuario que inició la inspección es el unico que puede
  const canEditFase = useMemo(() => {
    if (!activedFase) return false;
    return inspectionFase.some(
      (item) => item.faseId === activedFase.faseId && !item.initDate,
    );
  }, [inspectionFase, activedFase]);

  if (!isLoggedIn) return null;

  // Pasamos la data limpia y procesada a tu componente visual
  return (
    <InspectionContent
      id={id ? +id : 0}
      activedFase={activedFase}
      areas={areas}
      canEditFase={canEditFase}
      error={error}
      faseId={faseId ? +faseId : 0}
      groups={groups}
      hasPermission={hasPermission}
      inspection={inspection}
      inspectionDetail={inspectionDetail}
      inspectionFase={inspectionFase}
      load={load}
      observation={observation}
      setObservation={setObservation}
      setShowObservation={setShowObservation}
      showObservation={showObservation}
      userId={user?.userId ?? 0}
      onUpdateQuestionLocal={handleUpdateQuestionLocal}
    />
  );
}
