import { useAuthStore } from '@/store/useAuthStore';
import { GET_InspectionsFases } from '@/utils/fetchs/inspections/GET_InspectionFase';
import {
  DataInspection,
  GET_Inspections,
} from '@/utils/fetchs/inspections/GET_Inspections';
import {
  GroupInspectionsFase,
  type T_GroupInspectionsFase,
} from '@/utils/GroupInspectionsByFase';
import { useCallback, useState } from 'react';

export const HookInspections = () => {
  const { user } = useAuthStore();

  const [fases, setFases] = useState<T_GroupInspectionsFase[]>([]);
  const [inspections, setinspections] = useState<DataInspection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const GetInfoPage = useCallback(
    async ({ areaId }: { areaId: number }) => {
      if (!user?.token) return;

      setLoading(true);
      setError(null);

      try {
        // En lugar de esperar una por una, disparamos ambas en paralelo
        const [resFases, resInspections] = await Promise.all([
          GET_InspectionsFases({ areaId, token: user.token }),
          GET_Inspections({ areaId, token: user.token }),
        ]);

        // Procesamos las fases
        if (Array.isArray(resFases)) {
          const grouped = GroupInspectionsFase(resFases);
          setFases(grouped);
        }

        // Procesamos las inspecciones
        if (resInspections) {
          setinspections(resInspections);
        }
      } catch (err) {
        console.error('Error obteniendo fases:', err);
        setError('No se pudieron cargar las fases');
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  return { fases, inspections, loading, error, GetInfoPage };
};
