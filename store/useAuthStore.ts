import { DataAreas, GETALL_Areas } from '@/utils/fetchs/Areas/Get_Areas';
import type { DataUser } from '@/utils/fetchs/login/POST_Login';
import { Alert } from 'react-native';
import { create } from 'zustand';

interface AuthState {
  user: DataUser | null;
  areas: DataAreas[] | null;
  selectedSupplier: number | null;
  selectedArea: number | null;
  isLoggedIn: boolean;
  // Acciones
  login: (user: DataUser, areas: DataAreas[]) => void;
  logout: () => void;
  updateSupplier: (supplierId: number) => Promise<void>;
  setSelectedArea: (areaId: number) => void;
  checkSession: () => Promise<boolean>;
  // Agregamos la función a la interfaz
  validateAndSetAreas: (
    supplierId: number,
    areaId?: number,
  ) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  areas: null,
  selectedArea: null,
  selectedSupplier: null,
  isLoggedIn: false,

  login: (user, areas) => {
    set({
      user,
      areas,
      selectedSupplier: user.suppliers[0].id,
      selectedArea: areas[0].areaId,
      isLoggedIn: true,
    });
  },

  // Implementación de la validación
  validateAndSetAreas: async (supplierId: number, areaId?: number) => {
    const { user } = get();
    if (!user) return false;

    try {
      const newAreas = await GETALL_Areas({
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

      let selected_area;

      if (areaId === undefined) {
        selected_area = newAreas[0].areaId;
      } else {
        selected_area = areaId;
      }

      set({
        areas: newAreas,
        selectedArea: selected_area,
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

  updateSupplier: async (supplierId) => {
    const { validateAndSetAreas } = get();
    await validateAndSetAreas(supplierId);
  },

  setSelectedArea: async (areaId) => {
    const { selectedSupplier, validateAndSetAreas } = get();
    await validateAndSetAreas(selectedSupplier!, areaId);
  },

  logout: () =>
    set({
      user: null,
      areas: null,
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
