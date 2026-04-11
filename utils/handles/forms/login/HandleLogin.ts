import { GET_Encrypt } from '@/utils/fetchs/login/GET_Encrypt';
import { GET_Salt } from '@/utils/fetchs/login/GET_Salt';
import { POST_Login } from '@/utils/fetchs/login/POST_Login';
import { Alert } from 'react-native';

type Props = {
  username: string;
  password: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  login: (name: string, token: string) => void;
};

export const HandleLogin = async (props: Props) => {
  // Limpieza de datos
  const cleanUsername = props.username.trim();

  if (!cleanUsername || !props.password) {
    Alert.alert('Error', 'Por favor completa todos los campos');
    return;
  }

  props.setLoading(true);

  try {
    // Obtener Salt
    const salt = await GET_Salt({ username: cleanUsername });

    if (!salt) {
      Alert.alert(
        'Error',
        'Las credenciales son incorrectas, intente nuevamente',
      );
      return;
    }

    // Encriptar contraseña (Esto debe ser desde la api, ya que JS no lo maneja igual)
    const password_encrypt = await GET_Encrypt({
      password: props.password,
      salt,
    });

    if (!password_encrypt) {
      Alert.alert(
        'Error',
        'Ocurrio un error al momento de procesar su logueo, intente nuevamente',
      );
      return;
    }

    // 4. Petición de login
    const data_user = await POST_Login({
      username: cleanUsername,
      password: password_encrypt,
    });

    if (!data_user) {
      Alert.alert(
        'Error',
        'Las credenciales son incorrectas, intente nuevamente',
      );
      return;
    }

    props.login(data_user.name, data_user.token);
  } catch (error) {
    console.log('Login Error:', error);
    Alert.alert('Error', 'No se pudo conectar con el servidor.');
  } finally {
    props.setLoading(false);
  }
};
