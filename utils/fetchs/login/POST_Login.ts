const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Props = {
  username: string;
  password: string;
};

export type Dealer = {
  name: string;
  supplierId: null | string;
  id: number;
  isActive: boolean;
};

export type DataUser = {
  userId: number;
  login: string;
  name: string;
  lastname: string;
  token: string;
  suppliers: Dealer[];
  dealers: Dealer[];
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

    const { data } = await result.json();

    const data_user = {
      userId: data.users.id,
      login: data.users.login,
      name: data.users.name,
      lastname: data.users.lastName,
      token: data.token,
      suppliers: data.suppliers,
      dealers: data.dealers,
    } as DataUser;

    return data_user;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
