import {
  DataInspectionById,
  GET_InspectionById,
} from '@/utils/fetchs/inspections/GET_InspectionById';
import { GET_InspectionDetails } from '@/utils/fetchs/inspections/GET_InspectionDetailt';
import { GET_InspectionsFases } from '@/utils/fetchs/inspections/GET_InspectionFase';

export const GetInspectionData = async (
  inspectionId: number,
  token: string,
  setInspectionDetail: React.Dispatch<React.SetStateAction<any[]>>,
  setInspectionFase: React.Dispatch<React.SetStateAction<any[]>>,
  setInspection: React.Dispatch<
    React.SetStateAction<DataInspectionById | undefined>
  >,
) => {
  try {
    // 1. Ejecutamos ambas peticiones en paralelo para ganar velocidad
    const [rawInspectionDetail, rawFases, rawInspection] = await Promise.all([
      GET_InspectionDetails({ inspectionId, token }),
      GET_InspectionsFases({ inspectionId, token }),
      GET_InspectionById({ inspectionId, token }),
    ]);

    if (!rawInspection) {
      throw new Error(
        'No se encontró la información básica de la inspección.' + inspectionId,
      );
    }

    if (!rawInspectionDetail?.length || !rawInspectionDetail) {
      throw new Error(
        'No se encontraron los puntos de inspección (features).' + inspectionId,
      );
    }

    if (!rawFases?.length || !rawFases) {
      throw new Error(
        'Error al cargar la inspección, no se encontraron fases para esta inspección' +
          inspectionId,
      );
    }

    setInspection(rawInspection);
    setInspectionDetail(rawInspectionDetail);
    setInspectionFase(rawFases);
  } catch (error) {
    console.error('Error al cargar datos de inspección:', error);
    throw error;
  }
};
