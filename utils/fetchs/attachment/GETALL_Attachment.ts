import { useAuthStore } from '@/store/useAuthStore';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  recordId: number;
  moduleName: string;
};

export type DataAttachment = {
  fileName: string;
  recordId: number;
  moduleId: number;
  moduleName: string;
  dateCreate: Date;
  id: number;
  isActive: boolean;
};

type Response =
  | { ok: true; data: DataAttachment[]; status: number }
  | { ok: false; data: null; status: number };

export const GETALL_Attachment = async (props: Props): Promise<Response> => {
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

    const url = `${API_BASE}/Attachment/GetAll?recordId=${props.recordId}&moduleName=${props.moduleName}`;

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

    const data = data_json.data as DataAttachment[];

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
