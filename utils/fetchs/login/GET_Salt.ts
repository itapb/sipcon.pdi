const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  username: string;
};

export const GET_Salt = async (props: Props): Promise<string | null> => {
  try {
    const result = await fetch(
      `${API_BASE}/Security/GetSalt?Login=${props.username}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!result.ok) {
      const errorText = await result.text();
      console.log('Error en la petición:', errorText);
      return null;
    }

    const data = await result.json();
    return data.data.salt;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
