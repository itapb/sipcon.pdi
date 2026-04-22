import { Alert } from 'react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export type Props = {
  id: number;
  value: number | null;
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
    Observation: props.observation.trim() ? props.observation : 'S/O',
    InspectionId: props.inspectionId,
    FeatureId: props.featureId,
    ...(props.value !== null && { Value: +props.value }),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const result = await fetch(
      `${API_BASE}/InspectionsDetails/Post_InspectionsDetail`,
      {
        method: 'POST',
        signal: controller.signal,
        body: JSON.stringify([data_body]),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.token}`,
        },
      },
    );

    clearTimeout(timeoutId);

    if (!result.ok) {
      const errorText = await result.text();
      console.log('Error de validación o servidor:', errorText);
      return null;
    }

    const data = (await result.json()) as Result[];
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      Alert.alert(
        'Petición cancelada',
        'Tiempo agotado: El servidor tardó más de lo esperado',
      );
    } else {
      Alert.alert('Error', 'Ocurrio un error de red o configuración');
      console.log('Error de red o configuración:', error);
    }
    throw error;
  }
};
