const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  username: string;
  password: string;
};

export const POST_Login = async (props: Props) => {
  try {
    console.log('Haciendo la peticion');
    const result = await fetch(`${API_BASE}/Security/Auth_User2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: 'Usuario incorrecto',
        password: 'Contraseña incorrecta',
      }),
    });

    if (!result.ok) {
      const errorText = await result.text();
      console.log('Error del servidor:', errorText);
      return null;
    }

    const data = await result.json();
    return data.data.token;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
