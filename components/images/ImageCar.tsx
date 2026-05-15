import { type FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

type Props = {
  model_name: string;
};

const carImages: Record<string, any> = {
  ALSVINAT: require('../../assets/images/cars/ALSVINAT.png'),
  ALSVINMT: require('../../assets/images/cars/ALSVINMT.png'),
  ALT: require('../../assets/images/cars/ALT.png'),
  CS35PLUS: require('../../assets/images/cars/CS35PLUS.png'),
  CS55: require('../../assets/images/cars/CS55.png'),
  CS95: require('../../assets/images/cars/CS95.png'),
  'HUNTER-PLUS4X2': require('../../assets/images/cars/HUNTER-PLUS4X2.png'),
  'HUNTER-PLUS4X4': require('../../assets/images/cars/HUNTER-PLUS4X4.png'),
  HUNTER4X2: require('../../assets/images/cars/HUNTER4X2.png'),
  HUNTER4X4: require('../../assets/images/cars/HUNTER4X4.png'),
};

export const ImageCar: FC<Props> = (props) => {
  const modelKey = props.model_name.toUpperCase();
  const imageSource = carImages[modelKey] || carImages['ALT'];

  return (
    <View style={styles.imageContainer}>
      <Image
        source={imageSource}
        style={styles.vehicleImage}
        resizeMode='center'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  vehicleImage: {
    width: '100%',
    height: '100%',
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
});
