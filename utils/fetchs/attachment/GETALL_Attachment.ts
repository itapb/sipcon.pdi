const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  recordId: number;
  moduleName: string;
  token: string;
};

export type DataAttachment = {
  fileName: string;
  recordId: number;
  moduleId: number;
  moduleName: string;
  dateCreate: Date;
  id: number;
  isActive: boolean;
};

export const GETALL_Attachment = async (props: Props) => {
  try {
    const url = `${API_BASE}/Attachment/GetAll?recordId=${props.recordId}&moduleName=${props.moduleName}`;

    const result = await fetch(url, {
      method: 'GET',
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

    const data_json = await result.json();

    if (data_json.processed === false) {
      console.log('No se encontraron resultados');
      return null;
    }

    const data = data_json.data as DataAttachment[];

    return data;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
