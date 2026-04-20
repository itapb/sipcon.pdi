import { create } from 'zustand';

interface VehicleState {
  selectedVehicles: number[];
  setSelected: (vehicles: number[]) => void;
  toggleVehicle: (id: number) => void;
  clearSelection: () => void;
}

export const useVehicleStore = create<VehicleState>((set) => ({
  selectedVehicles: [],

  setSelected: (selectedVehicles) => set({ selectedVehicles }),

  toggleVehicle: (id) =>
    set((state) => ({
      selectedVehicles: state.selectedVehicles.includes(id)
        ? state.selectedVehicles.filter((itemId) => itemId !== id)
        : [...state.selectedVehicles, id],
    })),

  clearSelection: () => set({ selectedVehicles: [] }),
}));
