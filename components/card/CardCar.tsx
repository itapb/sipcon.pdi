import type { FC } from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MediaActions } from '../media/MediaActions';
import { ModalFiles } from '../modal/ModalFile';

type Props = {
  model_name: string;
  vin: string | number;
  plate: string;
  imageSource: ImageSourcePropType;
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
            <Text style={styles.label}>VIN:</Text>
            <Text style={styles.value}> {props.vin}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.label}>Placa:</Text>
            <Text style={styles.value}> {props.plate}</Text>
          </View>
        </View>

        <ModalFiles visible={true} onDismiss={() => {}} />

        {/* Acciones de media */}
        <MediaActions
          fileCount={1}
          additional_styles={{
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: 3,
          }}
        />

        {/* Contenedor de imagen */}
        <View style={styles.imageContainer}>
          <Image
            source={props.imageSource}
            style={styles.vehicleImage}
            resizeMode='cover'
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 5,
    borderRadius: 0,
  },
  content: {
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 7,
    alignItems: 'center',
    position: 'relative',
  },
  textSection: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 1,
    textTransform: 'uppercase',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#94A3B8',
    lineHeight: 19,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    lineHeight: 14,
  },
  imageContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    width: 100,
    height: 75,
    overflow: 'hidden',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
});
