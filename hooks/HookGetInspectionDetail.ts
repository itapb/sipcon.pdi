import { GET_InspectionDetails } from '@/utils/fetchs/inspections/GET_InspectionDetailt';
import { GET_InspectionsFases } from '@/utils/fetchs/inspections/GET_InspectionFase';

export const GetInspectionData = async (
  inspectionId: number,
  token: string,
  setInspectionDetail: React.Dispatch<React.SetStateAction<any[]>>,
  setInspectionFase: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  try {
    // 1. Ejecutamos ambas peticiones en paralelo para ganar velocidad
    const [rawInspection, rawFases] = await Promise.all([
      GET_InspectionDetails({ inspectionId, token }),
      GET_InspectionsFases({ inspectionId, token }),
    ]);

    // 2. Validamos que la data de detalles exista antes de procesar
    if (rawInspection && Array.isArray(rawInspection)) {
      setInspectionDetail(rawInspection);
    }

    // 3. Procesamos las fases (usando la función de únicos o la respuesta directa)
    if (rawFases && Array.isArray(rawFases)) {
      setInspectionFase(rawFases);
    }
  } catch (error) {
    console.error('Error al cargar datos de inspección:', error);
  }
};
