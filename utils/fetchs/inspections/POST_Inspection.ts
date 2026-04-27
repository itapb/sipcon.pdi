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
  IsDispatch: boolean;
};

type Props = {
  inspections: InspectionItem[];
  token: string;
};

type Result = {
  value: number;
  insertedRows: number;
  updatedRows: number;
  lastId: number;
};

export const POST_Inspection = async (props: Props) => {
  try {
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
    }));

    const result = await fetch(`${API_BASE}/Inspections/Post_Inspections`, {
      method: 'POST',
      body: JSON.stringify(data_body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
    });

    if (!result.ok) {
      const errorText = await result.text();
      console.log('Error en la petición:', errorText);
      return null;
    }

    const data = (await result.json()) as Result;

    return data;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
