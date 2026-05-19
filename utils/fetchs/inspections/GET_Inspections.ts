const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  areaId?: number;
  isCompleted?: boolean;
  token: string;
};

export type DataInspection = {
  areaId: number;
  closedBy: null | string;
  closedByName: string;
  created: Date;
  createdBy: number;
  dClose: null | Date;
  dInit: Date;
  dReception: Date;
  id: number;
  initBy: null | string;
  initByName: string;
  isActive: boolean;
  isCompleted: number;
  lote: string;
  model: string;
  nameArea: string;
  recepBy: null | string;
  recepByName: string;
  transporterId: null | number;
  transporterName: string;
  userName: string;
  vehicleId: number;
  vehiclePlate: string;
  vin: string;
};

type Response =
  | { ok: true; data: DataInspection[]; status: number }
  | { ok: false; data: null; status: number };

export const GET_Inspections = async (props: Props): Promise<Response> => {
  try {
    const params = new URLSearchParams();

    // Parametros dinámicos
    if (props.areaId !== undefined)
      params.append('areaId', props.areaId.toString());
    if (props.isCompleted !== undefined)
      params.append('isCompleted', props.isCompleted.toString());

    const queryString = params.toString();
    const url = `${API_BASE}/Inspections/GetAll${queryString ? `?${queryString}` : ''}`;

    const result = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.token}`,
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
    const data = data_json.data as DataInspection[];

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
