const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  userId: number;
  supplierId: number;
  dealerId: number;
  token: string;
};

export type DataAreas = {
  id: number;
  faseName: string;
  areaId: number;
  areaName: string;
};

export const GETALL_Areas = async (props: Props) => {
  try {
    const url = `${API_BASE}/PDI/AccessGroupPDI/GetAll?userId=${props.userId}&supplierId=${props.supplierId}&dealerId=${props.dealerId}`;

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

    const data = data_json.data as DataAreas[];

    return data;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
