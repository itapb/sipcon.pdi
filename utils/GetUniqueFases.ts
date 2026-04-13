import { DataInspectionDetail } from './fetchs/inspections/GET_InspectionDetailt';

export const GetUniqueFases = (data: DataInspectionDetail[]) => {
  if (!data || !Array.isArray(data)) return [];

  // 1. Extraemos solo las áreas/fases y las formateamos
  const allPhases = data.map((item) => ({
    id: item.faseId,
    name: item.fase,
    // Puedes añadir lógica para contar completados aquí si lo necesitas
  }));

  // 2. Filtramos duplicados usando un Map por el ID del área
  const uniquePhases = Array.from(
    new Map(allPhases.map((phase) => [phase.id, phase])).values(),
  );

  return uniquePhases;
};
