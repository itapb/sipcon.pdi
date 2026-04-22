import { T_GroupInspectionsFase } from '@/utils/GroupInspectionsByFase';
import { create } from 'zustand';

interface InspectionState {
  fases: T_GroupInspectionsFase[];
  inspections: any[];
  isLoaded: boolean; // Flag para saber si ya cargamos la primera vez
  needsRefresh: boolean;
  setInspectionsData: (fases: any[], inspections: any[]) => void;
  resetLoaded: () => void; // Para cuando necesites forzar un refresh total
  setNeedsRefresh: (status: boolean) => void;
}

export const useInspectionStore = create<InspectionState>((set) => ({
  fases: [],
  inspections: [],
  isLoaded: false,
  needsRefresh: false, // <-- NUEVO: Bandera de revalidación
  setInspectionsData: (fases, inspections) =>
    set({ fases, inspections, isLoaded: true }),
  resetLoaded: () => set({ isLoaded: false }),
  // Función para activar/desactivar el refresh
  setNeedsRefresh: (status: boolean) => set({ needsRefresh: status }),
}));
