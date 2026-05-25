import { DataAreas, GETALL_Areas } from '@/utils/fetchs/Areas/Get_Areas';
import type { DataUser } from '@/utils/fetchs/login/POST_Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

interface AuthState {
  user: Omit<DataUser, 'token'> | null;
  token: string | null;
  areas: DataAreas[] | null;
  selectedSupplier: number | null;
  selectedArea: number | null;
  isLoggedIn: boolean;
  // Acciones
  login: (user: DataUser, areas: DataAreas[]) => void;
  logout: () => void;
  updateSupplier: (supplierId: number) => Promise<void>;
  setSelectedArea: (areaId: number) => Promise<void>;
  checkSession: () => Promise<boolean>;
  validateAndSetAreas: (
    supplierId: number,
    areaId?: number,
  ) => Promise<boolean>;
}

const TokenSecureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const secureToken = await SecureStore.getItemAsync(`${name}_token`);
      const publicDataStr = await AsyncStorage.getItem(name);

      if (!publicDataStr) return null;

      const parsedPublic = JSON.parse(publicDataStr);

      // Inyectamos el token directamente en la raíz del estado, NUNCA dentro del objeto user
      if (parsedPublic.state && secureToken) {
        parsedPublic.state.token = secureToken;
      }

      return JSON.stringify(parsedPublic);
    } catch (e) {
      console.error('Error al leer el token seguro:', e);
      return null;
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const parsed = JSON.parse(value);
      const rawToken = parsed.state.token;

      // 1. Guardar el token en la bóveda segura del hardware
      if (rawToken) {
        await SecureStore.setItemAsync(`${name}_token`, rawToken);
      } else if (parsed.state.isLoggedIn === false) {
        await SecureStore.deleteItemAsync(`${name}_token`);
      }

      // 2. Eliminar por completo la propiedad token de la raíz antes de escribir en AsyncStorage
      const publicState = { ...parsed.state };
      delete publicState.token; // Desaparece del JSON plano de AsyncStorage

      await AsyncStorage.setItem(
        name,
        JSON.stringify({ state: publicState, version: parsed.version }),
      );
    } catch (e) {
      console.error('Error al escribir el token seguro:', e);
    }
  },

  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(`${name}_token`);
    await AsyncStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      areas: null,
      selectedArea: null,
      selectedSupplier: null,
      isLoggedIn: false,

      login: (user, areas) => {
        // Separamos el token del resto de los datos del usuario al iniciar sesión
        const { token, ...userWithoutToken } = user;

        set({
          user: userWithoutToken,
          token: token, // Se guarda de manera independiente
          areas,
          selectedSupplier: user.suppliers[0]?.id || null,
          selectedArea: areas[0]?.areaId || null,
          isLoggedIn: true,
        });
      },

      validateAndSetAreas: async (supplierId: number, areaId?: number) => {
        const { token, user } = get(); // Obtenemos el token desde la raíz
        if (!user || !token) return false;

        try {
          const newAreas = await GETALL_Areas({
            supplierId: supplierId,
            userId: user.userId,
          });

          if (!newAreas.ok) {
            Alert.alert(
              'Acceso Restringido',
              'La combinación seleccionada no tiene áreas configuradas. Por favor contacte con su supervisor.',
            );
            return false;
          }

          let selected_area =
            areaId === undefined ? newAreas.data[0].areaId : areaId;

          set({
            areas: newAreas.data,
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
          token: null,
          areas: null,
          selectedSupplier: null,
          selectedArea: null,
          isLoggedIn: false,
        }),

      checkSession: async () => {
        const API_BASE = process.env.EXPO_PUBLIC_API_URL;
        const { token, logout } = get(); // Obtenemos el token desde la raíz

        if (!token) {
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
                Authorization: `Bearer ${token}`,
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
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => TokenSecureStorage),
    },
  ),
);
