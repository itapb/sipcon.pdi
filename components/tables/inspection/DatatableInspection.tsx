import { DataInspection } from '@/utils/fetchs/inspections/GET_Inspections';
import { GroupLoteModel } from '@/utils/GroupLoteModel';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { DataTable, Divider, List, Text } from 'react-native-paper';
import { VehicleItem } from './VehicleRow';

const { height } = Dimensions.get('window');

type Props = {
  Inspections: DataInspection[];
};

export const DatatableInspection: React.FC<Props> = ({ Inspections }) => {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

  const DataLoteModels = GroupLoteModel({ items: Inspections });

  const allLotes = React.useMemo(
    () => Object.keys(DataLoteModels),
    [DataLoteModels],
  );

  const GoToInspection = (id: number) => {
    router.push({
      pathname: '/inspection/[id]',
      params: { id: id.toString() },
    });
  };

  const SelectVehicle = React.useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  }, []);

  return (
    <View style={styles.container}>
      <DataTable style={styles.tableCard}>
        <DataTable.Header style={styles.headerBackground}>
          <DataTable.Title textStyle={styles.headerText}>
            Lote / Modelo / plate
          </DataTable.Title>
          <DataTable.Title numeric textStyle={styles.headerText}>
            % Cumpl.
          </DataTable.Title>
        </DataTable.Header>

        <View style={styles.tableBodyContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {allLotes.map((loteName) => (
              <List.Accordion
                key={loteName}
                title={loteName}
                titleStyle={styles.loteTitle}
                style={styles.accordionHeader}
                left={(p) => (
                  <List.Icon
                    {...p}
                    icon='package-variant'
                    color='#2196F3'
                    style={styles.compactIcon}
                  />
                )}
              >
                {Object.keys(DataLoteModels[loteName]).map((modelName) => (
                  <List.Accordion
                    key={`${loteName}-${modelName}`}
                    title={`${modelName} (${DataLoteModels[loteName][modelName].length})`}
                    titleStyle={styles.modelTitle}
                    style={styles.modelAccordion}
                  >
                    {DataLoteModels[loteName][modelName].map((vehicle) => (
                      <View key={vehicle.id}>
                        <VehicleItem
                          vehicle={vehicle}
                          isSelected={selectedIds.includes(vehicle.id)}
                          onSelect={SelectVehicle}
                          onPressVim={() => GoToInspection(vehicle.id)}
                        />
                        <Divider />
                      </View>
                    ))}
                  </List.Accordion>
                ))}
              </List.Accordion>
            ))}
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Total seleccionados:{' '}
            <Text style={styles.boldText}>{selectedIds.length}</Text>
          </Text>
        </View>
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
  },
  tableCard: {
    width: '100%',
  },
  headerBackground: {
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontWeight: 'bold',
  },
  tableBodyContainer: {
    height: height * 0.45,
  },
  accordionHeader: {
    paddingVertical: 0,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  loteTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: -12,
  },
  modelAccordion: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 0,
    height: 50,
    justifyContent: 'center',
  },
  modelTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginLeft: -8,
  },
  compactIcon: {
    margin: 0,
    marginLeft: 10,
  },
  footer: {
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fafafa',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
  boldText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});
