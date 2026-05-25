import { useAuthStore } from '@/store/useAuthStore';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  inspectionId?: number;
  areaId?: number;
  faseId?: number;
  featureTypeId?: boolean;
};

export type DataInspectionDetail = {
  value: boolean;
  observation: string;
  fileUrl: null | string;
  inspectionId: number;
  featureId: number;
  feature: string;
  featureTypeId: number;
  featureValueTypeId: number;
  featureType: string;
  faseId: string;
  fase: string;
  areaId: number;
  area: string;
  color: string;
  model: string;
  vin: string;
  plate: string;
  id: number;
  isActive: boolean;
  hasFiles: boolean;
};

type Response =
  | { ok: true; data: DataInspectionDetail[]; status: number }
  | { ok: false; data: null; status: number };

export const GET_InspectionDetails = async (
  props: Props,
): Promise<Response> => {
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
    if (props.featureTypeId !== undefined)
      params.append('featureTypeId', props.featureTypeId.toString());

    const queryString = params.toString();
    const url = `${API_BASE}/InspectionsDetails/GetAll${queryString ? `?${queryString}` : ''}`;

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
    const data = data_json.data as DataInspectionDetail[];

    return {
      ok: true,
      data: data,
      status: result.status,
    };
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
