import { useAuthStore } from '@/store/useAuthStore';
import { GET_InspectionsFases } from '@/utils/fetchs/inspections/GET_InspectionFase';
import { GET_Inspections } from '@/utils/fetchs/inspections/GET_Inspections';
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
  const { user, isLoggedIn, areas, selectedArea } = useAuthStore();

  const [fases, setFases] = useState<T_GroupInspectionsFase[] | null>(null);
  const [inspections, setInspections] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const GetInfoPage = useCallback(
    async ({ areaId }: Props) => {
      if (!user?.token) return;

      setLoading(true);
      setError(null);

      try {
        const [resFases, resInspections] = await Promise.all([
          GET_InspectionsFases({ areaId, token: user.token }),
          GET_Inspections({ areaId, token: user.token }),
        ]);

        let finalFases = fases; // Por defecto mantenemos lo que hay
        let finalInspections = inspections;

        // Procesamos las fases
        if (Array.isArray(resFases)) {
          finalFases = GroupInspectionsFase(resFases);
        }

        // Procesamos las inspecciones
        if (resInspections) {
          finalInspections = resInspections;
        }

        setFases(finalFases);
        setInspections(finalInspections);
        // Guardamos todo en el Store Global
      } catch (err) {
        console.error('Error obteniendo datos:', err);
        setError('No se pudieron cargar los datos de inspección');
      } finally {
        setLoading(false);
      }
    },
    [user, fases, inspections],
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
    GetInfoPage,
  };
};
