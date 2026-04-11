const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  password: string;
  salt: string;
};

// TODO: Esto se debe aplicar pronto
export const GET_Encrypt = async (props: Props): Promise<string | null> => {
  try {
    // No uso template string ya que genera fallos
    const result = await fetch(
      API_BASE +
        '/Security/GetEncrypt?Password=' +
        props.password +
        '&Salt=' +
        props.salt,
    );

    if (!result.ok) {
      const errorText = await result.text();
      console.log('Error en la petición:', errorText);
      return null;
    }

    const encrypt = await result.text();
    return encrypt;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
