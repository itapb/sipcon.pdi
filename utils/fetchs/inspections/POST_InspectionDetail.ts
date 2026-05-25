import { useAuthStore } from '@/store/useAuthStore';

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

type Response =
  | { ok: true; data: Result[]; status: number }
  | { ok: false; data: null; status: number };

export const POST_InspectionDetail = async (
  items: InspectionDetailItem[],
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 40000);

  try {
    const { token } = useAuthStore.getState();

    if (!token) {
      clearTimeout(timeoutId);
      console.error('Error: No se encontró un token válido');

      return {
        ok: false,
        data: null,
        status: 401,
      };
    }

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
      return {
        ok: false,
        data: null,
        status: result.status,
      };
    }

    const data = (await result.json()) as Result[];

    return {
      ok: true,
      data: data,
      status: result.status,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('Error en Guardado Masivo:', error);

    // Determinamos el estatus si fue por cancelación del abort controlador (Timeout) o error de red
    const isTimeout = error.name === 'AbortError';
    return {
      ok: false,
      data: null,
      status: isTimeout ? 408 : 500, // 408 Request Timeout
    };
  }
};
