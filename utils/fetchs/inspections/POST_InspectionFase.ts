import { useAuthStore } from '@/store/useAuthStore';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export type Props = {
  Id: number;
  FaseId: number;
  InspectionId: number;
  CompletedDate?: Date;
  InitDate?: Date;
  UserInitId?: number;
};

type Result = {
  value: number;
  insertedRows: number;
  updatedRows: number;
  lastId: number;
};

type Response =
  | { ok: true; data: Result; status: number }
  | { ok: false; data: null; status: number };

export const POST_InspectionFase = async (props: Props): Promise<Response> => {
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

    const data_body: any = {
      Id: props.Id,
      FaseId: props.FaseId,
      InspectionId: props.InspectionId,
    };

    if (props.CompletedDate) {
      data_body.CompletedDate = props.CompletedDate;
    }

    if (props.InitDate) {
      data_body.InitDate = props.InitDate;
    }

    if (props.UserInitId) {
      data_body.UserInitId = props.UserInitId;
    }

    const result = await fetch(
      `${API_BASE}/InspectionFase/Post_InspectionFase`,
      {
        method: 'POST',
        body: JSON.stringify([data_body]),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!result.ok) {
      const errorText = await result.text();
      console.log('Error en la petición:', errorText);
      return {
        ok: false,
        data: null,
        status: result.status,
      };
    }

    const data = (await result.json()) as Result;

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
