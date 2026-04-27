const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  areaId?: number;
  isCompleted?: boolean;
  token: string;
};

export type DataInspection = {
  createdBy: number;
  vehicleId: number;
  areaId: number;
  initBy: null | string;
  closedBy: null | string;
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
  dInit: Date;
  dClose: null | Date;
  dReception: Date;
  isCompleted: number;
  id: number;
  isActive: boolean;
};

export const GET_Inspections = async (props: Props) => {
  try {
    const params = new URLSearchParams();

    // Modificamos para que el endpoint reciba parametros dinámicos
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
      return null;
    }

    const data_json = await result.json();

    const data = data_json.data as DataInspection[];

    return data;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
