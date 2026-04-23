import { DataInspectionFase } from './fetchs/inspections/GET_InspectionFase';

export type T_GroupInspectionsFase = {
  completed: number;
  name_fase: string;
  total: number;
  faseId: number;
  inpectionsId: [
    {
      id: number;
      completed: number;
    },
  ];
};

export const GroupInspectionsFase = (
  data: DataInspectionFase[],
): T_GroupInspectionsFase[] => {
  const grouped = data.reduce((acc: any, item: DataInspectionFase) => {
    const name = item.fase;
    const faseId = item.faseId;

    if (!acc[name]) {
      acc[name] = {
        name_fase: name,
        total: 0,
        completed: 0,
        faseId,
        inpectionsId: [],
      };
    }

    acc[name].total += 1;

    if (item.isCompleted === 1) {
      acc[name].completed += 1;
    }

    acc[name].inpectionsId.push({
      id: item.inspectionId,
      completed: item.isCompleted,
    });

    return acc;
  }, {});

  return Object.values(grouped);
};
