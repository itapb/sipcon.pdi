const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  token: string;
};

export type DataTransporter = {
  id: number;
  firstName: string;
};

export const GET_Transporter = async (props: Props) => {
  try {
    const result = await fetch(`${API_BASE}/PDI/Transporter/GetAll`, {
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
    const data = data_json.data as DataTransporter[];

    return data;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
