const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  supplierId: number;
  token: string;
};

export type DataDealer = {
  id: number;
  name: string;
  reference: string;
};

export const GET_Dealer = async (props: Props) => {
  try {
    const result = await fetch(
      `${API_BASE}/PDI/Dealer/GetAll?supplierId=${props.supplierId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.token}`,
        },
      },
    );

    if (!result.ok) {
      const errorText = await result.text();
      console.log('Error en la petición:', errorText);
      return null;
    }

    const data_json = await result.json();
    const data = data_json.data as DataDealer[];

    return data;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
