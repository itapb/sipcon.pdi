const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  token: string;
  userId: number;
  attachmentId: number;
};

type Result = {
  value: number;
  insertedRows: number;
  updatedRows: number;
  lastId: number;
};

export const POST_DeleteAttachment = async (props: Props) => {
  try {
    const url = `${API_BASE}/Attachment/Delete_Attachment?userId=${props.userId}&attachmentId=${props.attachmentId}`;

    const result = await fetch(url, {
      method: 'POST',
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

    const data = (await result.json()) as Result;

    return data;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
