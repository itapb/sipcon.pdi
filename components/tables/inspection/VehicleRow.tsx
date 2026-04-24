import { T_GroupInspectionsFase } from '@/utils/GroupInspectionsByFase';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';

export type VehicleData = {
  id: number;
  vin: string;
  vehiclePlate: string;
  cumplimiento: string | number;
  fases: T_GroupInspectionsFase[];
};

type VehicleItemProps = {
  vehicle: VehicleData;
  isSelected: boolean;
  fase: T_GroupInspectionsFase[];
  onSelect: (id: number) => void;
  onPressVim: (id: number) => void;
};

export const VehicleItem = React.memo((props: VehicleItemProps) => {
  const fase_count = props.fase.length;
  const fase_completed = props.fase.filter((item) => {
    return item.inpectionsId.some(
      (inspection) =>
        inspection.completed === 1 && inspection.id === props.vehicle.id,
    );
  }).length;

  const compliance =
    fase_count > 0 ? Math.round((fase_completed / fase_count) * 100) : 0;

  return (
    <View style={styles.vehicleRow}>
      {/* Celda del Checkbox */}
      <View style={styles.checkCell}>
        {compliance === 100 && (
          <Checkbox
            status={props.isSelected ? 'checked' : 'unchecked'}
            onPress={() => props.onSelect(props.vehicle.id)}
            color='#2196F3'
          />
        )}
      </View>

      {/* Contenedor de Información */}
      <View style={styles.vehicleInfoContainer}>
        <View style={styles.textColumn}>
          <Pressable
            onPress={() => props.onPressVim(props.vehicle.id)}
            hitSlop={10}
          >
            <Text style={[styles.vinText, styles.linkText]}>
              VIN: {props.vehicle.vin || 'SIN VIN'}
            </Text>
          </Pressable>
          <Text style={styles.plateText}>
            Placa: {props.vehicle.vehiclePlate}
          </Text>

          {/* Contenedor de Etiquetas (Badges) */}
          <View style={styles.badgeContainer}>
            {props.fase.map((fase, index) => {
              // Lógica para determinar si la fase está completa para este vehículo
              const isCompleted = fase.inpectionsId.some(
                (item) => item.id === props.vehicle.id && item.completed === 1,
              );

              return (
                <View
                  key={`${index}-${fase.name_fase}-${props.vehicle.id}`}
                  style={[
                    styles.badge,
                    isCompleted ? styles.badgeCompleted : styles.badgePending,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      isCompleted
                        ? styles.badgeTextCompleted
                        : styles.badgeTextPending,
                    ]}
                  >
                    {fase.name_fase}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Porcentaje de cumplimiento */}
        <View style={styles.complianceContainer}>
          <Text style={styles.complianceText}>{compliance}%</Text>
        </View>
      </View>
    </View>
  );
});

VehicleItem.displayName = 'VehicleItem';

const styles = StyleSheet.create({
  vehicleRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
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
    flex: 1,
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
    marginBottom: 4,
  },
  complianceContainer: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  complianceText: {
    fontWeight: 'bold',
    color: '#2e7d32',
    fontSize: 13,
  },
  // Estilos de los Badges
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeCompleted: {
    backgroundColor: '#E8F5E9',
    borderColor: '#C8E6C9',
  },
  badgePending: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeTextCompleted: {
    color: '#2E7D32',
  },
  badgeTextPending: {
    color: '#9E9E9E',
  },
});
