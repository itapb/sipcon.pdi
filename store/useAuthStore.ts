import { DataAreas } from '@/utils/fetchs/Areas/Get_Areas';
import type { DataUser } from '@/utils/fetchs/login/POST_Login';
import { create } from 'zustand';

interface AuthState {
  user: DataUser | null;
  areas: DataAreas[] | null;
  selectedDealer: number | null;
  selectedSupplier: number | null;
  selectedArea: number | null;
  isLoggedIn: boolean;
  // Acciones (Funciones para cambiar el estado)
  login: (user: DataUser, areas: DataAreas[]) => void;
  logout: () => void;
  setSelectedDealer: (dealerId: number) => void;
  setSelectedSupplier: (supplierId: number) => void;
  setSelectedArea: (AreaId: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  areas: null,
  selectedArea: null,
  selectedDealer: null,
  selectedSupplier: null,
  isLoggedIn: false,

  login: async (user, areas) => {
    set({
      user,
      areas,
      selectedSupplier: user.suppliers[0].id,
      selectedDealer: user.dealers[0].id,
      selectedArea: areas[0].areaId,
      isLoggedIn: true,
    });
  },

  logout: () =>
    set({
      user: null,
      areas: null,
      selectedDealer: null,
      selectedSupplier: null,
      isLoggedIn: false,
    }),

  setSelectedDealer: (dealerId) => set({ selectedDealer: dealerId }),
  setSelectedSupplier: (supplierId) => set({ selectedSupplier: supplierId }),
  setSelectedArea: (areaId) => set({ selectedArea: areaId }),
}));
