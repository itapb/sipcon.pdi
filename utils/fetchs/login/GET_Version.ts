const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  token: string;
  version: string;
};

export interface DataVersion {
  version: string;
  id: number;
  isActive: boolean;
}

type Response =
  | { ok: true; data: DataVersion; status: number }
  | { ok: false; data: null; status: number };

export const GET_Version = async (props: Props): Promise<Response> => {
  try {
    const { token } = props;

    if (!token) {
      console.error('Error: No se encontró un token válido');
      return {
        ok: false,
        data: null,
        status: 401,
      };
    }

    const url = `${API_BASE}/Inspection/ActualVersion`;

    const result = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!result.ok) {
      const errorText = await result.text();
      console.log('Error en la petición:', errorText);
      return {
        ok: false,
        data: null,
        status: 401,
      };
    }

    const data_json = await result.json();

    if (data_json.processed === false) {
      console.log('No se encontraron resultados');
      return {
        ok: false,
        data: null,
        status: 401,
      };
    }

    const data = data_json.data as DataVersion;

    return {
      ok: true,
      data,
      status: 401,
    };
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
