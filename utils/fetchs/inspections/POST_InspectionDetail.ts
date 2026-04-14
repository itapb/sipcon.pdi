const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export type Props = {
  id: number;
  value: boolean | null;
  observation: string;
  inspectionId: number;
  featureId: number;
  token: string;
};

export type Result = {
  value: number;
  insertedRows: number;
  updatedRows: number;
  lastId: number;
};

export const POST_InspectionDetail = async (props: Props) => {
  const data_body = {
    id: props.id,
    Observation: props.observation,
    InspectionId: props.inspectionId,
    FeatureId: props.featureId,
    ...(props.value !== null && { Value: props.value }),
  };

  try {
    const result = await fetch(
      `${API_BASE}/InspectionDetail/Post_InspectionsDetail`,
      {
        method: 'POST',
        body: JSON.stringify([data_body]),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.token}`,
        },
      },
    );

    // console.log({ a: result });

    if (!result.ok) {
      const errorText = await result.text();
      console.log('Error en la petición:', errorText);
      return null;
    }

    const data = (await result.json()) as Result[];

    return data;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
