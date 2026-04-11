const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  username: string;
  password: string;
};

export type UserAPI = {
  status: number;
  processed: boolean;
  message: string;
  total: number;
  data: Data;
};

export type Data = {
  token: string;
  refreshToken: string;
  users: Users;
  suppliers: Dealer[];
  dealers: Dealer[];
  modules: Module[];
};

export type Dealer = {
  name: string;
  type: Type;
  supplierId: null | string;
  id: number;
  isActive: boolean;
};

export enum Type {
  Dealer = 'DEALER',
  Supplier = 'SUPPLIER',
}

export type Module = {
  id: number;
  name: string;
  actionName: null;
  actionDisplay: null;
  actions: Action[];
};

export type Action = {
  moduleId: number;
  actionId: number;
  actionName: ActionName;
};

export enum ActionName {
  Create = 'CREATE',
  Edit = 'EDIT',
  Get = 'GET',
}

export type Users = {
  login: string;
  name: string;
  lastName: string;
  vat: string;
  id: number;
  isActive: boolean;
};

export const POST_Login = async (props: Props) => {
  try {
    const result = await fetch(`${API_BASE}/Security/Auth_User2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: props.username,
        password: props.password,
      }),
    });

    if (!result.ok) {
      const errorText = await result.text();
      console.log('Error en la petición:', errorText);
      return null;
    }

    const { data } = (await result.json()) as UserAPI;
    const data_user = {
      userId: data.users.id,
      login: data.users.login,
      name: data.users.name,
      lastname: data.users.lastName,
      token: data.token,
      suppliers: data.suppliers,
      dealers: data.dealers,
    };

    return data_user;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
