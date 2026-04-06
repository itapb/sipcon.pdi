import { Picker } from '@react-native-picker/picker';

import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [area, setArea] = useState('');

  const handleLogin = () => {
    // Aquí podrías validar los datos antes de entrar
    if (!usuario || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    console.log('Ingresando con:', { usuario, area });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/images/logos/LogoAPB.png')}
        style={styles.logoCustom}
      />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Inicia Sesión</Text>

        <View>
          {/* Input 1: Usuario */}
          <Text style={styles.label}>Usuario:</Text>
          <TextInput
            style={styles.input}
            placeholder='Ingrese el usuario'
            value={usuario}
            onChangeText={setUsuario}
          />
        </View>

        <View>
          {/* Input 2: Contraseña */}
          <Text style={styles.label}>Contraseña:</Text>
          <TextInput
            style={styles.input}
            placeholder='Ingrese su contraseña'
            secureTextEntry={true} // Oculta el texto
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View>
          {/* Input 3: Lista */}
          <Text style={styles.label}>Área:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={area}
              onValueChange={(itemValue) => setArea(itemValue)}
              style={styles.picker}
            >
              <Picker.Item
                label='Selecciona una planta...'
                value=''
                style={{ display: 'none' }}
              />
              <Picker.Item label='Planta Calidad' value='plantacalidad' />
              <Picker.Item label='Distribuión' value='distribución' />
              <Picker.Item label='Ventas' value='ventas' />
              <Picker.Item
                label='Servicio concesionario'
                value='sconcesionario'
              />
            </Picker>
          </View>
        </View>

        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>INGRESAR</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.labelPasword}>Olvidé mi contraseña</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginTop: 30,
  },
  logoCustom: {
    width: 200,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
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
