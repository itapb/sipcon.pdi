const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  featureId: number;
  token: string;
};

export interface DataFeatureOptions {
  id: number;
  isActive: boolean;
  name: string;
  featureId: number;
}

export const GET_FeatureOptions = async (props: Props) => {
  try {
    const url = `${API_BASE}/FeatureOption/GetAll?featureId=${props.featureId}`;

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

    const data = data_json.data as DataFeatureOptions;

    return data;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
