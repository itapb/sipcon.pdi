import { DataInspectionFase } from './fetchs/inspections/GET_InspectionFase';

export type T_GroupInspectionsFase = {
  completed: number;
  name_fase: string;
  total: number;
};

export const GroupInspectionsFase = (
  data: DataInspectionFase[],
): T_GroupInspectionsFase[] => {
  const grouped = data.reduce((acc: any, item: any) => {
    const name = item.fase;

    if (!acc[name]) {
      acc[name] = {
        name_fase: name,
        total: 0,
        completed: 0,
      };
    }

    acc[name].total += 1;

    if (item.isCompleted === 1 || item.isCompleted === true) {
      acc[name].completed += 1;
    }

    return acc;
  }, {});

  return Object.values(grouped);
};
