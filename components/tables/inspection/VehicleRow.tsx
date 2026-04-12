import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';

export type VehicleData = {
  id: number;
  vin: string;
  vehiclePlate: string;
  cumplimiento: string | number;
};

type VehicleItemProps = {
  vehicle: VehicleData;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onPressVim: (id: number) => void;
};

export const VehicleItem = React.memo(
  ({ vehicle, isSelected, onSelect, onPressVim }: VehicleItemProps) => {
    return (
      <View style={styles.vehicleRow}>
        {/* Celda del Checkbox */}
        <View style={styles.checkCell}>
          <Checkbox
            status={isSelected ? 'checked' : 'unchecked'}
            onPress={() => onSelect(vehicle.id)}
            color='#2196F3'
          />
        </View>

        {/* Contenedor de Información */}
        <View style={styles.vehicleInfoContainer}>
          <View style={styles.textColumn}>
            <Pressable onPress={() => onPressVim(vehicle.id)} hitSlop={10}>
              <Text style={[styles.vinText, styles.linkText]}>
                VIN: {vehicle.vin || 'SIN VIN'}
              </Text>
            </Pressable>
            <Text style={styles.plateText}>Placa: {vehicle.vehiclePlate}</Text>
          </View>

          {/* Porcentaje de cumplimiento */}
          <View style={styles.complianceContainer}>
            <Text style={styles.complianceText}>{vehicle.cumplimiento}%</Text>
          </View>
        </View>
      </View>
    );
  },
);

VehicleItem.displayName = 'VehicleItem';

const styles = StyleSheet.create({
  vehicleRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
  },
  checkCell: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 4,
  },
  textColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  vinText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  linkText: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
  plateText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  complianceContainer: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  complianceText: {
    fontWeight: 'bold',
    color: '#2e7d32',
    fontSize: 13,
  },
});
