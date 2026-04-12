import { useAuthStore } from '@/store/useAuthStore';
import { GET_InspectionsFases } from '@/utils/fetchs/inspections/GET_InspectionFase';
import {
  GroupInspectionsFase,
  type T_GroupInspectionsFase,
} from '@/utils/GroupInspectionsByFase';
import { useCallback, useState } from 'react';

export const HookInspections = () => {
  const { user } = useAuthStore();

  const [fases, setFases] = useState<T_GroupInspectionsFase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const GetFasesByArea = useCallback(
    async (areaId: number) => {
      if (!user?.token) return;

      setLoading(true);
      setError(null);

      try {
        const result = await GET_InspectionsFases({
          areaId,
          token: user.token,
        });

        if (result && Array.isArray(result)) {
          const grouped = GroupInspectionsFase(result);
          setFases(grouped);
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

  return { fases, loading, error, GetFasesByArea };
};
