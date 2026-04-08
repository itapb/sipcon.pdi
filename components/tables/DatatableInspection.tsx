import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Checkbox, DataTable, Divider, List, Text } from 'react-native-paper';
import { GetItems } from './data';

const { height } = Dimensions.get('window');

// --- INTERFACES ---
interface VehicleItemProps {
  vehiculo: any;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onPressVim: (id: number) => void;
}

// --- SUB-COMPONENTE: FILA DE VEHÍCULO ---
const VehicleItem = React.memo(
  ({ vehiculo, isSelected, onSelect, onPressVim }: VehicleItemProps) => (
    <View style={styles.vehicleRow}>
      <View style={styles.checkCell}>
        <Checkbox
          status={isSelected ? 'checked' : 'unchecked'}
          onPress={() => onSelect(vehiculo.id)}
        />
      </View>
      <View style={styles.vehicleInfoContainer}>
        <View style={styles.textColumn}>
          <Pressable onPress={() => onPressVim(vehiculo.id)}>
            <Text style={[styles.vimText, styles.linkText]}>
              {vehiculo.vim || `VIM000000${vehiculo.id}`}
            </Text>
          </Pressable>
          <Text style={styles.plateText}>Placa: {vehiculo.placa}</Text>
        </View>
        <Text style={styles.complianceText}>{vehiculo.cumplimiento}%</Text>
      </View>
    </View>
  ),
);

VehicleItem.displayName = 'VehicleItem';

// --- COMPONENTE PRINCIPAL ---
export const DatatableInspection = () => {
  const router = useRouter();
  const items = GetItems() || [];

  // Estados
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [page, setPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(5);

  // Agrupación de datos (Lote -> Modelo)
  const nestedData = React.useMemo(() => {
    const groups: Record<string, Record<string, any[]>> = {};
    items.forEach((item: any) => {
      if (!groups[item.lote]) groups[item.lote] = {};
      if (!groups[item.lote][item.modelo]) groups[item.lote][item.modelo] = [];
      groups[item.lote][item.modelo].push(item);
    });
    return groups;
  }, [items]);

  const allLotes = React.useMemo(() => Object.keys(nestedData), [nestedData]);

  // Lógica de paginación por Lotes
  const paginatedLotes = React.useMemo(() => {
    const start = page * itemsPerPage;
    return allLotes.slice(start, start + itemsPerPage);
  }, [allLotes, page, itemsPerPage]);

  // Handlers
  const handleSelectVehicle = React.useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  }, []);

  const handleGoToInspection = (id: number) => {
    router.push({
      pathname: '/inspection/[id]',
      params: { id: id },
    });
  };

  return (
    <View style={styles.container}>
      <DataTable style={styles.tableCard}>
        <DataTable.Header style={styles.headerBackground}>
          <DataTable.Title textStyle={styles.headerText}>
            Lote / Modelo / VIM
          </DataTable.Title>
          <DataTable.Title numeric textStyle={styles.headerText}>
            Estado
          </DataTable.Title>
        </DataTable.Header>

        <View style={styles.tableBodyContainer}>
          <ScrollView>
            {paginatedLotes.map((loteName) => (
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
                {Object.keys(nestedData[loteName]).map((modeloName) => (
                  <List.Accordion
                    key={`${loteName}-${modeloName}`}
                    title={`${modeloName} (${nestedData[loteName][modeloName].length})`}
                    titleStyle={styles.modeloTitle}
                    style={styles.modeloAccordion}
                  >
                    {nestedData[loteName][modeloName].map((vehiculo) => (
                      <View key={vehiculo.id}>
                        <VehicleItem
                          vehiculo={vehiculo}
                          isSelected={selectedIds.includes(vehiculo.id)}
                          onSelect={handleSelectVehicle}
                          onPressVim={handleGoToInspection}
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

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(allLotes.length / itemsPerPage)}
          onPageChange={(p) => setPage(p)}
          label={`${page * itemsPerPage + 1}-${Math.min((page + 1) * itemsPerPage, allLotes.length)} de ${allLotes.length}`}
          numberOfItemsPerPageList={[5, 10, 20]}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setPage(0);
          }}
          selectPageDropdownLabel={'Filas:'}
        />

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

// --- ESTILOS COMPACTOS ---
const styles = StyleSheet.create({
  container: { width: '100%', backgroundColor: 'white' },
  tableCard: { width: '100%' },
  headerBackground: { backgroundColor: '#f5f5f5' },
  headerText: { fontWeight: 'bold' },
  tableBodyContainer: { height: height * 0.35 },

  // Estilos de Acordeón Compacto
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
  modeloAccordion: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 0,
    height: 50,
    justifyContent: 'center',
  },
  modeloTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginLeft: -8,
  },
  compactIcon: {
    margin: 0,
    marginLeft: 10,
  },

  // Fila de Vehículo
  vehicleRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 10,
  },
  checkCell: { width: 45, alignItems: 'center' },
  vehicleInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  textColumn: { flexDirection: 'column' },
  vimText: { fontSize: 14, fontWeight: 'bold' },
  linkText: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
  plateText: { fontSize: 11, color: '#777' },
  complianceText: { fontWeight: 'bold', color: '#2e7d32', fontSize: 13 },

  // Footer
  footer: {
    padding: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: { fontSize: 12, color: '#888' },
  boldText: { color: '#2196F3', fontWeight: 'bold' },
});
