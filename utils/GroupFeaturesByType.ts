import { DataInspectionDetail } from './fetchs/inspections/GET_InspectionDetailt';

export const GroupFeaturesByType = (data: DataInspectionDetail[]) => {
  if (!data || !Array.isArray(data)) return [];

  const grouped = data.reduce((acc: any[], item: DataInspectionDetail) => {
    // 1. Buscamos si ya existe el grupo por el Título (FeatureType)
    let group = acc.find((g) => g.featureType === item.featureType);

    if (!group) {
      group = {
        // Usamos el área o un identificador de fase real si lo tienes,
        // si no, usamos el featureType normalizado como ID
        fase: item.fase,
        featureType: item.featureType,
        faseId: item.faseId,
        questions: [],
      };
      acc.push(group);
    }

    // 2. Mapeamos toda la información relacionada al "question"
    group.questions.push({
      id: item.id,
      featureId: item.featureId,
      text: item.feature,
      value: item.value,
      observation: item.observation,
      fileUrl: item.fileUrl,
      inspectionId: item.inspectionId,
    });

    return acc;
  }, []);

  return grouped;
};
