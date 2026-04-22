const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export type Props = {
  Id: number;
  FaseId: number;
  InspectionId: number;
  CompletedDate?: Date;
  InitDate?: Date;
  token: string;
};

type Result = {
  value: number;
  insertedRows: number;
  updatedRows: number;
  lastId: number;
};

export const POST_InspectionFase = async (props: Props) => {
  try {
    const data_body: any = {
      Id: props.Id,
      FaseId: props.FaseId,
      InspectionId: props.InspectionId,
    };

    if (props.CompletedDate) {
      data_body.CompletedDate = props.CompletedDate;
    }

    if (props.InitDate) {
      data_body.InitDate = props.InitDate;
    }

    const result = await fetch(
      `${API_BASE}/InspectionFase/Post_InspectionFase`,
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
