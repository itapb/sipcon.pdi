import { useAuthStore } from '@/store/useAuthStore';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  areaId?: number;
  faseId?: number;
  inspectionId?: number;
  IsCompleted?: boolean;
  Completed: boolean;
};

export type DataInspectionFase = {
  inspectionId: number;
  faseId: number;
  fase: string;
  completedDate: Date | null;
  isCompleted: number;
  initDate: Date | null;
  areaId: number;
  area: string;
  id: number;
  isActive: boolean;
  userInitId: number | null;
  login: string;
  Completed: number;
};

type Response =
  | { ok: true; data: DataInspectionFase[]; status: number }
  | { ok: false; data: null; status: number };

export const GET_InspectionsFases = async (props: Props): Promise<Response> => {
  try {
    const { token } = useAuthStore.getState();

    if (!token) {
      console.error('Error: No se encontró un token válido');
      return {
        ok: false,
        data: null,
        status: 401,
      };
    }

    const params = new URLSearchParams();

    // Modificamos para que el endpoint reciba parametros dinámicos
    if (props.areaId !== undefined)
      params.append('areaId', props.areaId.toString());
    if (props.faseId !== undefined)
      params.append('faseId', props.faseId.toString());
    if (props.inspectionId !== undefined)
      params.append('inspectionId', props.inspectionId.toString());
    if (props.IsCompleted !== undefined)
      params.append('IsCompleted', props.IsCompleted.toString());
    if (props.Completed !== undefined)
      params.append('IsCompletedInspection', props.Completed.toString());

    const queryString = params.toString();
    const url = `${API_BASE}/InspectionFase/GetAll${queryString ? `?${queryString}` : ''}`;

    const result = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!result.ok) {
      const errorText = await result.text();
      console.log('Error en la petición:', errorText);
      return {
        ok: false,
        data: null,
        status: result.status,
      };
    }

    const data_json = await result.json();
    const data = data_json.data as DataInspectionFase[];

    return {
      ok: true,
      data,
      status: result.status,
    };
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
