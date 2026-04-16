const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  Id: number;
  token: string;
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
};

type Result = {
  value: number;
  insertedRows: number;
  updatedRows: number;
  lastId: number;
};

export const POST_Inspection = async (props: Props) => {
  try {
    const data_body = {
      Id: props.Id,
      CreatedBy: props.CreatedBy,
      VehicleId: props.VehicleId,
      AreaId: props.AreaId,
      InitBy: props.InitBy,
      ClosedBy: props.ClosedBy,
      TransporterId: props.TransporterId,
      RecepBy: props.RecepBy,
      DInit: props.DInit,
      DClose: props.DClose,
      DReception: props.DReception,
    };

    const result = await fetch(`${API_BASE}/Inspections/Post_Inspections`, {
      method: 'POST',
      body: JSON.stringify([data_body]),
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
