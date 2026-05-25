import { useAuthStore } from '@/store/useAuthStore';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  inspectionId: number;
};

export type DataInspectionById = {
  createdBy: number;
  vehicleId: number;
  areaId: number;
  initBy: null | string;
  closedBy: null | string;
  comment: null | string;
  transporterId: null | number;
  recepBy: null | string;
  userName: string;
  initByName: string;
  closedByName: string;
  transporterName: string;
  recepByName: string;
  vehiclePlate: string;
  model: string;
  lote: string;
  vin: string;
  nameArea: string;
  created: Date;
  dInit: Date | null;
  dClose: null | Date;
  dReception: Date;
  isCompleted: number;
  id: number;
  isActive: boolean;
  hasFiles: boolean;
};

type Response =
  | { ok: true; data: DataInspectionById; status: number }
  | { ok: false; data: null; status: number };

export const GET_InspectionById = async (props: Props): Promise<Response> => {
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

    const url = `${API_BASE}/Inspections/GetOne?InspectionId=${props.inspectionId}`;

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

    if (data_json.processed === false) {
      console.log('No se encontraron resultados');
      return {
        ok: false,
        data: null,
        status: result.status,
      };
    }

    const data = data_json.data as DataInspectionById;

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
