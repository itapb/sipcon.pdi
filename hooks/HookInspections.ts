import { useAuthStore } from '@/store/useAuthStore';
import { useInspectionStore } from '@/store/useInspectionStore'; // Importamos el nuevo store
import { GET_InspectionsFases } from '@/utils/fetchs/inspections/GET_InspectionFase';
import { GET_Inspections } from '@/utils/fetchs/inspections/GET_Inspections';
import { GroupInspectionsFase } from '@/utils/GroupInspectionsByFase';
import { useCallback, useState } from 'react';

type Props = {
  areaId: number;
  forceRefresh?: boolean;
};

export const HookInspections = () => {
  const { user } = useAuthStore();
  const {
    fases,
    inspections,
    isLoaded,
    setInspectionsData,
    needsRefresh,
    setNeedsRefresh,
  } = useInspectionStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const GetInfoPage = useCallback(
    async ({ areaId, forceRefresh = false }: Props) => {
      if (!user?.token) return;

      // Si ya tenemos datos y no estamos obligando a refrescar, salimos discretamente
      if (isLoaded && !forceRefresh) return;

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

        // Guardamos todo en el Store Global
        setInspectionsData(finalFases, finalInspections);
      } catch (err) {
        console.error('Error obteniendo datos:', err);
        setError('No se pudieron cargar los datos de inspección');
      } finally {
        setLoading(false);
      }
    },
    [user, isLoaded, setInspectionsData, fases, inspections],
  );

  return {
    fases,
    inspections,
    loading,
    error,
    GetInfoPage,
    needsRefresh,
    setNeedsRefresh,
  };
};
