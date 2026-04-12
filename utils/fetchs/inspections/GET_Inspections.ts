const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  areaId?: number;
  token: string;
};

export interface DataInspection {
  createdBy: number;
  vehicleId: number;
  areaId: number;
  userName: string;
  vehiclePlate: string;
  model: string;
  lote: string | null;
  vin: string;
  nameArea: string;
  created: Date;
  updated: Date;
  id: number;
  isActive: boolean;
}

export const GET_Inspections = async (props: Props) => {
  try {
    const params = new URLSearchParams();

    // Modificamos para que el endpoint reciba parametros dinámicos
    if (props.areaId !== undefined)
      params.append('areaId', props.areaId.toString());

    const queryString = params.toString();
    const url = `${API_BASE}/Inspection/GetAll${queryString ? `?${queryString}` : ''}`;

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
