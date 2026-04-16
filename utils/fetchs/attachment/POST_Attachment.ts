const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type AttachmentProps = {
  token: string;
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

export const POST_Attachment = async (props: AttachmentProps) => {
  try {
    const formData = new FormData();

    // En React Native, el objeto del archivo debe tener uri, name y type
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
        Authorization: `Bearer ${props.token}`,
      },
    });

    if (!result.ok) {
      const errorText = await result.text();
      console.log('Error en la petición de adjunto:', errorText);
      return null;
    }

    const data_json = await result.json();
    const data = data_json.data as Result;

    return data;
  } catch (error) {
    console.error('Error de red al subir adjunto:', error);
    throw error;
  }
};
