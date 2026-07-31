import { DataAreas, GETALL_Areas } from '@/utils/fetchs/Areas/Get_Areas';
import { GET_Encrypt } from '@/utils/fetchs/login/GET_Encrypt';
import { GET_Salt } from '@/utils/fetchs/login/GET_Salt';
import { GET_Version } from '@/utils/fetchs/login/GET_Version';
import { DataUser, POST_Login } from '@/utils/fetchs/login/POST_Login';
import { Alert } from 'react-native';

type Props = {
  username: string;
  password: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  login: (user: DataUser, area: DataAreas[]) => void;
};

export const HandleLogin = async (props: Props) => {
  // Limpieza de datos
  const cleanUsername = props.username.trim();
  const version = process.env.EXPO_PUBLIC_VERSION ?? '';

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

    const areas = await GETALL_Areas({
      supplierId: data_user.suppliers[0].id,
      userId: data_user.userId,
      token: data_user.token,
    });

    if (!areas.ok) {
      Alert.alert(
        'Error',
        'El usuario no tiene su rol configurado, por favor contactar con su supervisor',
      );
      return;
    }

    // Validar si la version es correcta

    const response_version = await GET_Version({
      token: data_user.token,
      version: version,
    });

    if (!response_version.ok) {
      Alert.alert(
        'Error',
        `Ocurrió un error al procesar la versión de la aplicación PDI en tu dispositivo`,
      );
      return;
    }

    if (response_version.data.version !== version) {
      Alert.alert(
        'Error',
        `Para continuar, es necesario contar con la última versión de PDI (${version}). Te invitamos a contactar al equipo de T.I.C. para realizar la actualización a la (${response_version.data.version}).`,
      );
      return;
    }

    props.login(data_user, areas.data);
  } catch (error) {
    console.log('Login Error:', error);
    Alert.alert('Error', 'No se pudo conectar con el servidor.');
  } finally {
    props.setLoading(false);
  }
};
