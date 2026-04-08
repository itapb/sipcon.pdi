import { Feather } from '@expo/vector-icons';
import { FC, useState } from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';
import { DatatableInspection } from './DatatableInspection';

const { width } = Dimensions.get('window');

export const TableInspection: FC = () => {
  const [search, setsearch] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.container_input}>
        <Feather name='search' size={20} color='#999' />
        <TextInput
          style={styles.input}
          placeholder='Buscar Modelo o VIM'
          placeholderTextColor={'#999'}
          value={search}
          onChangeText={setsearch}
        />
      </View>

      <DatatableInspection />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container_input: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fafafa',
    width: width * 0.9,
    gap: 5,
  },
  input: {
    height: 50,
    width: width * 0.7,
    color: '#333',
  },
  scroll: {
    width: '100%', // El scroll ocupa todo el ancho
    flex: 1, // El scroll ocupa todo el alto restante
  },
  scrollContent: {
    paddingBottom: 20, // Espacio extra al final para que no pegue con el borde
    flexGrow: 1, // Importante para que el contenido se expanda
  },
});
