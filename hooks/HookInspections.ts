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
import { useCallback, useState } from 'react';

type Props = {
  areaId: number;
  forceRefresh?: boolean;
};

export const HookInspections = () => {
  //  Variable global del usuario y selección de la unidad
  const { user, isLoggedIn, areas, selectedArea, selectedSupplier } =
    useAuthStore();
  const ClearSelection = useVehicleStore((state) => state.clearSelection);

  // Estados para guardar la información de las fases e inspecciones
  const [fases, setFases] = useState<T_GroupInspectionsFase[] | null>(null);
  const [inspections, setInspections] = useState<DataInspection[] | null>(null);

  // Estados de carga y errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función principal que me retorna todos los valores
  const GetInfoPage = useCallback(
    async (props: Props) => {
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

        if (!resFases.ok || !resInspections.ok) {
          setError('Error al momento de solicitar las fases o la inspecciones');
          setFases(null);
          setInspections(null);
          return;
        }

        const dataFase = resFases.data;
        const dataInspection = resInspections.data;

        // Guardamos la información en los states
        setFases(dataFase.length ? GroupInspectionsFase(dataFase) : []);
        setInspections(dataInspection);
      } catch (err) {
        console.error('Error obteniendo datos:', err);
        setError('No se pudieron cargar los datos de inspección');
      } finally {
        setLoading(false);
      }
    },
    [user?.token],
  );

  return {
    fases,
    inspections,
    loading,
    error,
    isLoggedIn,
    user,
    areas,
    selectedArea,
    selectedSupplier,
    ClearSelection,
    GetInfoPage,
  };
};
