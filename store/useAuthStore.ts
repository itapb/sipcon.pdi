import { DataAreas, GETALL_Areas } from '@/utils/fetchs/Areas/Get_Areas';
import type { DataUser } from '@/utils/fetchs/login/POST_Login';
import { Alert } from 'react-native';
import { create } from 'zustand';

interface AuthState {
  user: DataUser | null;
  areas: DataAreas[] | null;
  selectedDealer: number | null;
  selectedSupplier: number | null;
  selectedArea: number | null;
  isLoggedIn: boolean;
  // Acciones
  login: (user: DataUser, areas: DataAreas[]) => void;
  logout: () => void;
  updateDealer: (dealerId: number) => Promise<void>;
  updateSupplier: (supplierId: number) => Promise<void>;
  setSelectedArea: (areaId: number) => void;
  checkSession: () => Promise<boolean>;
  // Agregamos la función a la interfaz
  validateAndSetAreas: (
    dealerId: number,
    supplierId: number,
  ) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  areas: null,
  selectedArea: null,
  selectedDealer: null,
  selectedSupplier: null,
  isLoggedIn: false,

  login: (user, areas) => {
    set({
      user,
      areas,
      selectedSupplier: user.suppliers[0].id,
      selectedDealer: user.dealers[0].id,
      selectedArea: areas[0].areaId,
      isLoggedIn: true,
    });
  },

  // Implementación de la validación
  validateAndSetAreas: async (dealerId: number, supplierId: number) => {
    const { user } = get();
    if (!user) return false;

    try {
      const newAreas = await GETALL_Areas({
        dealerId: dealerId,
        supplierId: supplierId,
        token: user.token,
        userId: user.userId,
      });

      if (!newAreas || newAreas.length === 0) {
        Alert.alert(
          'Acceso Restringido',
          'La combinación seleccionada no tiene áreas configuradas. Por favor contacte con su supervisor.',
        );
        return false;
      }

      set({
        areas: newAreas,
        selectedArea: newAreas[0].areaId,
        selectedDealer: dealerId,
        selectedSupplier: supplierId,
      });
      return true;
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudieron validar las áreas para esta selección.',
      );
      return false;
    }
  },

  updateDealer: async (dealerId) => {
    const { selectedSupplier, validateAndSetAreas } = get();
    await validateAndSetAreas(dealerId, selectedSupplier!);
  },

  updateSupplier: async (supplierId) => {
    const { selectedDealer, validateAndSetAreas } = get();
    await validateAndSetAreas(selectedDealer!, supplierId);
  },

  setSelectedArea: (areaId) => set({ selectedArea: areaId }),

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

      if (result.status === 401) throw new Error('Token vencido');
      return true;
    } catch (error: any) {
      console.error('Sesión expirada', error);
      logout();
      return false;
    }
  },
}));
