import type { FC } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MediaActions } from '../media/MediaActions';

type Props = {
  model_name: string;
  vin: string | number;
  plate: string;
  color: string;
  year: string;
  inspectionId: number;
  userId: number;
  readOnly: boolean;
  hasFiles: boolean;
};

export const CardCar: FC<Props> = (props) => {
  return (
    <Card mode='contained' style={styles.card}>
      <Card.Content style={styles.content}>
        {/* Sección de texto */}
        <View style={styles.textSection}>
          <Text style={styles.title} numberOfLines={1}>
            {props.model_name}
          </Text>

          <View style={styles.dataRow}>
            <Text style={styles.label}>VIN</Text>
            <Text style={styles.monoValue} numberOfLines={1}>
              {props.vin} — {props.year}
            </Text>
          </View>

          <View style={styles.splitRow}>
            {/* Bloque Placa */}
            <View style={styles.gridItem}>
              <Text style={styles.label}>PLACA</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {props.plate}
              </Text>
            </View>

            {/* Bloque Color */}
            <View style={styles.gridItem}>
              <Text style={styles.label}>COLOR</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {props.color}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <MediaActions
            hasFiles={props.hasFiles}
            fileCount={1}
            additional_styles={{
              flexDirection: 'column',
              gap: 8,
            }}
            recordID={props.inspectionId}
            moduleName='INSPECCION-INSPECCION'
            userId={props.userId}
            readOnly={props.readOnly}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
  },
  content: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  textSection: {
    flex: 1,
    paddingRight: 8,
    gap: 6,
  },
  actionSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    textTransform: 'uppercase',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  gridItem: {
    flex: 1, // Hace que Placa y Color midan exactamente el 50% del espacio inferior cada uno
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingVertical: 2,
    borderRadius: 4,
    textAlign: 'center',
    overflow: 'hidden',
  },
  monoValue: {
    flex: 1,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
    color: '#334155',
  },
  infoValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    textTransform: 'uppercase',
  },
});
