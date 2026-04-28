const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export type InspectionDetailItem = {
  id: number;
  Value: number | null;
  Observation: string;
  InspectionId: number;
  FeatureId: number;
};

export type Result = {
  value: number;
  insertedRows: number;
  updatedRows: number;
  lastId: number;
};

export const POST_InspectionDetail = async (
  items: InspectionDetailItem[],
  token: string,
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 40000);

  try {
    const result = await fetch(
      `${API_BASE}/InspectionsDetails/Post_InspectionsDetail`,
      {
        method: 'POST',
        signal: controller.signal,
        body: JSON.stringify(items), // Enviamos el array completo
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
    console.error('Error en Guardado Masivo:', error);
    return false;
  }
};
