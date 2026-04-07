import { Feather } from '@expo/vector-icons';
import { FC, useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';

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
      <Text>Tabla</Text>
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fafafa',
    gap: 5,
  },
  input: {
    height: 50,
    width: width * 0.75,
    color: '#333',
  },
});
