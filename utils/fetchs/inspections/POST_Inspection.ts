import { useAuthStore } from '@/store/useAuthStore';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

// Definimos el objeto individual de inspección
export type InspectionItem = {
  Id: number;
  CreatedBy?: number;
  VehicleId?: number;
  AreaId?: number;
  InitBy?: number;
  ClosedBy?: number;
  TransporterId?: number;
  RecepBy?: number;
  DInit?: Date;
  DClose?: Date;
  DReception?: Date;
  IsDispatch?: boolean;
  Comment?: string;
  BranchOffice?: number;
};

type Props = {
  inspections: InspectionItem[];
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

export const POST_Inspection = async (props: Props): Promise<Response> => {
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

    // Mapeamos el array para asegurar que la estructura coincida con lo que espera el backend
    const data_body = props.inspections.map((item) => ({
      Id: item.Id,
      CreatedBy: item.CreatedBy,
      VehicleId: item.VehicleId,
      AreaId: item.AreaId,
      InitBy: item.InitBy,
      ClosedBy: item.ClosedBy,
      TransporterId: item.TransporterId,
      RecepBy: item.RecepBy,
      DInit: item.DInit,
      DClose: item.DClose,
      DReception: item.DReception,
      IsDispatch: item.IsDispatch,
      Comment: item.Comment,
      BranchOffice: item.BranchOffice,
    }));

    const result = await fetch(`${API_BASE}/Inspections/Post_Inspections`, {
      method: 'POST',
      body: JSON.stringify(data_body),
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
