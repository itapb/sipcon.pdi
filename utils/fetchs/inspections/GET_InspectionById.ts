const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  inspectionId: number;
  token: string;
};

export type DataInspectionById = {
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
  dInit: Date | null;
  dClose: null | Date;
  dReception: Date;
  isCompleted: number;
  id: number;
  isActive: boolean;
  hasFiles: boolean;
};

export const GET_InspectionById = async (props: Props) => {
  try {
    const url = `${API_BASE}/Inspections/GetOne?InspectionId=${props.inspectionId}`;

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

    if (data_json.processed === false) {
      console.log('No se encontraron resultados');
      return null;
    }

    const data = data_json.data as DataInspectionById;

    return data;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
