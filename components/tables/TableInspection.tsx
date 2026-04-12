import { DataInspection } from '@/utils/fetchs/inspections/GET_Inspections';
import { FC, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { DatatableInspection } from './inspection/DatatableInspection';

const { width } = Dimensions.get('window');

type Props = {
  Inspections: DataInspection[];
};

export const TableInspection: FC<Props> = ({ Inspections }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder='Buscar Modelo o VIN'
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
      />

      <DatatableInspection Inspections={Inspections} />
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
    width: '100%',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  searchBar: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 45,
    width: width * 0.9,
    marginVertical: 10,
  },
  searchInput: {
    fontSize: 14,
    minHeight: 0,
  },
});
