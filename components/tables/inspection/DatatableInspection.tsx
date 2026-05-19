import { useVehicleStore } from '@/store/useVehicleStore';
import { DataInspection } from '@/utils/fetchs/inspections/GET_Inspections';
import { T_GroupInspectionsFase } from '@/utils/GroupInspectionsByFase';
import { GroupLoteModel } from '@/utils/GroupLoteModel';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { DataTable, Divider, List, Text } from 'react-native-paper';
import { VehicleItem } from './VehicleRow';

const { height } = Dimensions.get('window');

type Props = {
  Inspections: DataInspection[];
  fases: T_GroupInspectionsFase[];
  filterFaseId?: number;
};

export const DatatableInspection: React.FC<Props> = ({
  Inspections = [],
  fases = [],
  filterFaseId = 0,
}) => {
  const router = useRouter();

  const selectedVehicles = useVehicleStore((state) => state.selectedVehicles);
  const toggleVehicle = useVehicleStore((state) => state.toggleVehicle);
  const clearSelection = useVehicleStore((state) => state.clearSelection);

  // 1. Memorizamos la agrupación para evitar ejecuciones innecesarias en memoria
  const DataLoteModels = React.useMemo(() => {
    return GroupLoteModel({ items: Inspections });
  }, [Inspections]);

  const allLotes = React.useMemo(
    () => Object.keys(DataLoteModels),
    [DataLoteModels],
  );

  const GoToInspection = (id: number) => {
    clearSelection();

    // CONTROL DE SEGURIDAD: Evita mandar un faseId "0" inválido si 'fases' llega vacío
    const targetFaseId = fases?.[0]?.faseId ?? filterFaseId;

    if (!targetFaseId || targetFaseId === 0) {
      console.warn('Intento de navegación bloqueado: faseId no es válido.');
      return;
    }

    router.push({
      pathname: '/inspection/[id]',
      params: { id: id.toString(), faseId: targetFaseId.toString() },
    });
  };

  // 2. Renderizador de cada Lote (Fila principal optimizada por FlatList)
  const renderLoteRow = ({ item: loteName }: { item: string }) => {
    // Protección por si el lote actual se encuentra vacío o indefinido en el objeto mapeado
    if (!DataLoteModels[loteName]) return null;

    return (
      <List.Accordion
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
            {DataLoteModels[loteName][modelName].map((vehicle) => {
              // Adaptamos el objeto mapeando de forma segura hacia tu VehicleData original
              const adaptedVehicle = {
                id: vehicle.id,
                vin: vehicle.vin || '',
                vehiclePlate: vehicle.vehiclePlate || '',
                cumplimiento: vehicle.compliancePercentage ?? 0,
                fases: fases,
              };

              return (
                <View key={vehicle.id}>
                  <VehicleItem
                    vehicle={adaptedVehicle}
                    fase={fases}
                    isSelected={selectedVehicles.some(
                      (item) => item.vehicleId === vehicle.id,
                    )}
                    onSelect={() => {
                      toggleVehicle({
                        vehicleId: vehicle.id,
                        vin: vehicle.vin,
                        plate: vehicle.vehiclePlate,
                      });
                    }}
                    onPressVim={() => GoToInspection(vehicle.id)}
                  />
                  <Divider />
                </View>
              );
            })}
          </List.Accordion>
        ))}
      </List.Accordion>
    );
  };

  return (
    <View style={styles.container}>
      <DataTable style={styles.tableCard}>
        <DataTable.Header style={styles.headerBackground}>
          <DataTable.Title textStyle={styles.headerText}>
            Lote / Modelo / Placa
          </DataTable.Title>
          <DataTable.Title numeric textStyle={styles.headerText}>
            % Cumpl.
          </DataTable.Title>
        </DataTable.Header>

        {/* Cuerpo virtualizado con límite de altura dinámico controlado */}
        <View style={styles.tableBodyContainer}>
          <FlatList
            data={allLotes}
            renderItem={renderLoteRow}
            keyExtractor={(lote) => lote}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Total seleccionados:{' '}
            <Text style={styles.boldText}>{selectedVehicles.length}</Text>
          </Text>
        </View>
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', backgroundColor: 'white' },
  tableCard: { width: '100%' },
  headerBackground: { backgroundColor: '#f5f5f5' },
  headerText: { fontWeight: 'bold' },
  tableBodyContainer: { height: height * 0.45 },
  accordionHeader: {
    paddingVertical: 0,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  loteTitle: { fontWeight: 'bold', fontSize: 14, marginLeft: -12 },
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
  compactIcon: { margin: 0, marginLeft: 10 },
  footer: {
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fafafa',
  },
  footerText: { fontSize: 12, color: '#888' },
  boldText: { color: '#2196F3', fontWeight: 'bold' },
});
