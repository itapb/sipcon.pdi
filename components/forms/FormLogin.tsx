import { useAuthStore } from '@/store/useAuthStore';
import { Picker } from '@react-native-picker/picker';
import React, { useState, type FC } from 'react';
import {
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
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [area, setArea] = useState('');

  const { login } = useAuthStore();

  const handleLogin = () => {
    if (!usuario || !password || !area) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Al ejecutar esto, el isLoggedIn del Store cambia a true.
    // El _layout.tsx detectará el cambio y hará el router.replace('/') por ti.
    login(usuario, area);
  };

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
          value={usuario}
          onChangeText={setUsuario}
        />
      </View>

      {/* Input 2: Contraseña */}
      <View>
        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          placeholder='Ingrese su contraseña...'
          placeholderTextColor={'#999'}
          secureTextEntry={true} // Oculta el texto
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Input 3: Lista */}
      <View>
        <Text style={styles.label}>Área:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={area}
            onValueChange={(itemValue) => setArea(itemValue)}
            style={styles.picker}
            dropdownIconColor='#333'
          >
            <Picker.Item
              label='Selecciona una planta...'
              value=''
              style={{ display: 'none' }}
            />
            <Picker.Item label='Planta Calidad' value='plantacalidad' />
            <Picker.Item label='Distribución' value='distribución' />
            <Picker.Item label='Ventas' value='ventas' />
            <Picker.Item
              label='Servicio concesionario'
              value='sconcesionario'
            />
          </Picker>
        </View>
      </View>

      {/* Boton de ingreso */}
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>INGRESAR</Text>
        </TouchableOpacity>
      </View>

      {/* Opción en casos de olvidar la contraseña */}
      <View>
        <Text style={styles.labelPasword}>Olvidé mi contraseña</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: width * 0.9, // 90% del ancho real del dispositivo
    height: height * 0.7, // 60% del alto real del dispositivo
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
    fontSize: 12,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  labelPasword: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF', // Azul estándar, puedes cambiarlo al color de tu logo
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
