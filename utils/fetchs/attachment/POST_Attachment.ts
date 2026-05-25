import { useAuthStore } from '@/store/useAuthStore';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type AttachmentProps = {
  userId: number;
  moduleName: string;
  recordId: number;
  file: {
    uri: string;
    name: string;
    type: string;
  };
};

type Result = {
  value: number;
  insertedRows: number;
  updatedRows: number;
  lastId: number;
};

type Response =
  | { ok: true; data: Result; status: number }
  | { ok: false; data: null; status: number };

export const POST_Attachment = async (
  props: AttachmentProps,
): Promise<Response> => {
  try {
    const { token } = useAuthStore.getState();

    if (!token) {
      console.error('Error: No se encontró un token válido');
      return {
        ok: false,
        data: null,
        status: 401,
      };
    }

    const formData = new FormData();

    formData.append('files', {
      uri: props.file.uri,
      name: props.file.name,
      type: props.file.type,
    } as any);

    const url = `${API_BASE}/Attachment/PostAttachments?userId=${props.userId}&moduleName=${props.moduleName}&recordId=${props.recordId}`;

    const result = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!result.ok) {
      const errorText = await result.text();
      console.log('Error en la petición de adjunto:', errorText);
      return {
        ok: false,
        data: null,
        status: result.status,
      };
    }

    const data_json = await result.json();
    const data = data_json.data as Result;

    return {
      ok: true,
      data: data,
      status: result.status,
    };
  } catch (error) {
    console.error('Error de red al subir adjunto:', error);
    throw error;
  }
};
