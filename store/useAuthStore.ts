import type { DataUser } from '@/utils/fetchs/login/POST_Login';
import { create } from 'zustand';

interface AuthState {
  user: DataUser | null;
  area: number | null;
  selectedDealer: number | null;
  selectedSupplier: number | null;
  isLoggedIn: boolean;
  // Acciones (Funciones para cambiar el estado)
  login: (user: DataUser, area: number) => void;
  logout: () => void;
  setSelectedDealer: (dealerId: number) => void;
  setSelectedSupplier: (supplierId: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  area: null,
  selectedDealer: null,
  selectedSupplier: null,
  isLoggedIn: false,

  login: (user, area) => {
    const filterDealersCero = user.dealers.filter((item) => item.id !== 0);

    user.dealers = filterDealersCero;

    set({
      user,
      area,
      selectedSupplier: user.suppliers[0].id,
      selectedDealer: filterDealersCero[0].id,
      isLoggedIn: true,
    });
  },

  logout: () =>
    set({
      user: null,
      area: null,
      selectedDealer: null,
      selectedSupplier: null,
      isLoggedIn: false,
    }),

  setSelectedDealer: (dealerId) => set({ selectedDealer: dealerId }),
  setSelectedSupplier: (supplierId) => set({ selectedSupplier: supplierId }),
}));
