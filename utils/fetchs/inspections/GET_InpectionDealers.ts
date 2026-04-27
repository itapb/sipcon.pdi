const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  inspectionIds: number[];
  token: string;
};

export type DataInspectionDealers = {
  inspectionId: number;
  vehicleId: number;
  dealerId: number;
  dealerName: string;
};

export const GET_InpectionDealers = async (props: Props) => {
  try {
    const url = `${API_BASE}/Inspections/GetDealers?ids=[${props.inspectionIds.toString()}]`;

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

    const data = data_json.data as DataInspectionDealers[];

    return data;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
