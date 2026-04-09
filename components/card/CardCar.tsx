import type { FC } from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MediaActions } from '../media/MediaActions';

type Props = {
  model_name: string;
  vin: string | number;
  plate: string;
  imageSource: ImageSourcePropType;
};

export const CardCar: FC<Props> = (props) => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        {/* Sección de texto */}
        <View style={styles.textSection}>
          <Text style={styles.title} numberOfLines={1}>
            {props.model_name}
          </Text>
          <View style={styles.dataRow}>
            <Text style={styles.label}>VIN:</Text>
            <Text style={styles.value}> {props.vin}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Placa:</Text>
            <Text style={styles.value}> {props.plate}</Text>
          </View>
        </View>

        {/* Imagen del vehículo  */}
        <View style={styles.imageContainer}>
          <Image
            source={props.imageSource}
            style={styles.vehicleImage}
            resizeMode='contain'
          />
        </View>

        {/* Iconos superiores más discretos */}
        <MediaActions
          fileCount={1}
          additional_styles={{ left: 12, top: 10, position: 'absolute' }}
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    paddingTop: 22,
    paddingBottom: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    position: 'relative',
  },
  textSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A253A',
    marginBottom: 2,
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7B8FA1',
  },
  value: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  imageContainer: {
    backgroundColor: '#F3F5F7',
    borderRadius: 10,
    width: 130,
    height: 95,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginLeft: 8,
  },
  vehicleImage: {
    width: '90%',
    height: '90%',
  },
});
