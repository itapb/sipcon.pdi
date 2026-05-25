import { useAuthStore } from '@/store/useAuthStore';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  userId: number;
  supplierId: number;
  token?: string; // Este token es opcional ya que tambie uso esta función en el login
};

export type DataAreas = {
  id: number;
  faseName: string;
  areaId: number;
  areaName: string;
  givesOutCar: boolean;
};

type Response =
  | { ok: true; data: DataAreas[]; status: number }
  | { ok: false; data: null; status: number };

export const GETALL_Areas = async (props: Props): Promise<Response> => {
  try {
    const token = props.token || useAuthStore.getState().token;

    if (!token) {
      console.error(
        'Error: No se encontró un token válido para consultar las áreas.',
      );

      return {
        ok: false,
        data: null,
        status: 401,
      };
    }

    const url = `${API_BASE}/PDI/AccessGroupPDI/GetAll?userId=${props.userId}&supplierId=${props.supplierId}`;

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

    const data = data_json.data as DataAreas[];

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
