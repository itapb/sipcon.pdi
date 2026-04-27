import { create } from 'zustand';

// Definimos el tipo con CamelCase por convención de TypeScript
export type SelectedVehicle = {
  vehicleId: number;
  vin: string;
  plate: string;
};

interface VehicleState {
  selectedVehicles: SelectedVehicle[];
  setSelected: (vehicles: SelectedVehicle[]) => void;
  toggleVehicle: (vehicle: SelectedVehicle) => void;
  clearSelection: () => void;
}

export const useVehicleStore = create<VehicleState>((set) => ({
  selectedVehicles: [],

  setSelected: (selectedVehicles) => set({ selectedVehicles }),

  toggleVehicle: (vehicle) =>
    set((state) => {
      const isSelected = state.selectedVehicles.some(
        (item) => item.vehicleId === vehicle.vehicleId,
      );

      return {
        selectedVehicles: isSelected
          ? state.selectedVehicles.filter(
              (item) => item.vehicleId !== vehicle.vehicleId,
            )
          : [...state.selectedVehicles, vehicle],
      };
    }),

  clearSelection: () => set({ selectedVehicles: [] }),
}));
