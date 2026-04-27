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
  checkSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
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

  checkSession: async () => {
    const API_BASE = process.env.EXPO_PUBLIC_API_URL;

    const { user, logout } = get();

    if (!user || !user.token) {
      logout();
      return false;
    }

    try {
      const result = await fetch(
        `${API_BASE}/Inspections/GetAll?areaId=-1&isCompleted=-1`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (result.status === 401) {
        throw new Error('Token vencido');
      }

      return true;
    } catch (error: any) {
      // Si la API responde 401 o el token no es válido, cerramos sesión
      console.error('Sesión expirada o inválida', error);
      logout();
      return false;
    }
  },

  setSelectedDealer: (dealerId) => set({ selectedDealer: dealerId }),
  setSelectedSupplier: (supplierId) => set({ selectedSupplier: supplierId }),
  setSelectedArea: (areaId) => set({ selectedArea: areaId }),
}));
