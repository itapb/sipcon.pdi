const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  userId: number;
  AreaId: number;
  Identifier: string;
  token: string;
};

type Result = {
  value: number;
  insertedRows: number;
  updatedRows: number;
  lastId: number;
};

export const POST_FullInspection = async (props: Props) => {
  try {
    const data_body = {
      AreaId: props.AreaId,
      Identifier: props.Identifier,
    };

    const result = await fetch(
      `${API_BASE}/Post_FullInspection?userId=${props.userId}`,
      {
        method: 'POST',
        body: JSON.stringify([data_body]),
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

    const data = (await result.json()) as Result;

    return data;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
