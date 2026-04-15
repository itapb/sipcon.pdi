const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  areaId?: number;
  faseId?: number;
  inspectionId?: number;
  IsCompleted?: boolean;
  token: string;
};

export type DataInspectionFase = {
  inspectionId: number;
  faseId: number;
  fase: string;
  completedDate: Date | null;
  isCompleted: number;
  areaId: number;
  area: string;
  id: number;
  isActive: boolean;
};

export const GET_InspectionsFases = async (props: Props) => {
  try {
    const params = new URLSearchParams();

    // Modificamos para que el endpoint reciba parametros dinámicos
    if (props.areaId !== undefined)
      params.append('areaId', props.areaId.toString());
    if (props.faseId !== undefined)
      params.append('faseId', props.faseId.toString());
    if (props.inspectionId !== undefined)
      params.append('inspectionId', props.inspectionId.toString());
    if (props.IsCompleted !== undefined)
      params.append('IsCompleted', props.IsCompleted.toString());

    const queryString = params.toString();
    const url = `${API_BASE}/InspectionFase/GetAll${queryString ? `?${queryString}` : ''}`;

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
    const data = data_json.data as DataInspectionFase[];

    return data;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
