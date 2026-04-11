import { useAuthStore } from '@/store/useAuthStore';
import { HandleLogin } from '@/utils/handles/forms/login/HandleLogin';
import React, { useState, type FC } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export const FormLogin: FC = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Inicia Sesión</Text>

      {/* Input 1: Usuario */}
      <View>
        <Text style={styles.label}>Usuario:</Text>
        <TextInput
          style={styles.input}
          placeholder='Ingrese el usuario...'
          placeholderTextColor={'#999'}
          value={username}
          onChangeText={setUserName}
          autoCapitalize='none'
          autoCorrect={false}
        />
      </View>

      {/* Input 2: Contraseña */}
      <View>
        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          placeholder='Ingrese su contraseña...'
          placeholderTextColor={'#999'}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Boton de ingreso */}
      <View>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => HandleLogin({ login, password, setLoading, username })}
          activeOpacity={0.7}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.containerButton}>
              <Text style={styles.buttonText}>Validando</Text>
              <ActivityIndicator size='small' color='#FFFFFF' />
            </View>
          ) : (
            <Text style={styles.buttonText}>INGRESAR</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Opción en casos de olvidar la contraseña */}
      <View>
        <TouchableOpacity
          onPress={() => Alert.alert('Aviso', 'Contacte a soporte.')}
        >
          <Text style={styles.labelPasword}>Olvidé mi contraseña</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: width * 0.9,
    height: height * 0.7,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    borderColor: '#eee',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  labelPasword: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A0C4FF',
  },
  containerButton: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
