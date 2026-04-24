import { DataInspection } from '@/utils/fetchs/inspections/GET_Inspections';
import { T_GroupInspectionsFase } from '@/utils/GroupInspectionsByFase';
import { FC, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { DatatableInspection } from './inspection/DatatableInspection';

const { width } = Dimensions.get('window');

type Props = {
  Inspections: DataInspection[];
  fases: T_GroupInspectionsFase[];
  filterFaseId: number;
};

export const TableInspection: FC<Props> = ({
  Inspections,
  fases,
  filterFaseId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInspections = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const inspectionsInFase = Inspections.filter((inspection) => {
      if (filterFaseId == 0) return true;

      return fases.some(
        (fase) =>
          fase.faseId == filterFaseId &&
          fase.inpectionsId.some(
            (item) => item.id == inspection.id && !item.completed,
          ),
      );
    });

    if (query === '') {
      return inspectionsInFase;
    }

    return inspectionsInFase.filter((item) => {
      const model = item.model?.toLowerCase() || '';
      const vin = item.vin?.toLowerCase() || '';
      const plate = item.vehiclePlate?.toLowerCase() || '';
      const lote = item.lote?.toLowerCase() || '';

      return (
        model.includes(query) ||
        vin.includes(query) ||
        plate.includes(query) ||
        lote.includes(query)
      );
    });
  }, [searchQuery, Inspections, filterFaseId, fases]);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder='Buscar Modelo, VIN o Placa'
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        onIconPress={() => setSearchQuery('')}
      />

      <DatatableInspection Inspections={filteredInspections} fases={fases} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
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
    alignSelf: 'center',
  },
});
