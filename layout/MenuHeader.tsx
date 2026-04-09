import { Ionicons } from '@expo/vector-icons';
import { FC } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export const MenuHeader: FC = () => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => console.log('Abrir menú')}
        style={styles.menuButton}
      >
        <Ionicons name='menu' size={30} color='#333' />
      </TouchableOpacity>

      <Image
        source={require('../assets/images/logos/LogoAPB.png')}
        style={{
          width: 100,
          height: 80,
          resizeMode: 'center',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  menuButton: {
    padding: 5,
  },
});
