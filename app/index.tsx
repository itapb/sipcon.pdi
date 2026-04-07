import { CardFase } from '@/components/card/CardFase';
import { TableInspection } from '@/components/tables/TableInspection';
import { useAuthStore } from '@/store/useAuthStore';
import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import React from 'react';

import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { isLoggedIn, user, area } = useAuthStore();

  const fases = [
    {
      color: '#16A34A',
      name_fase: 'Chequeo',
      completed: 30,
      total: 61,
      iconName: <AntDesign name='check' size={24} color='#16A34A' />,
    },
    {
      color: '#004A99',
      name_fase: 'Ensamblaje',
      completed: 12,
      total: 61,
      iconName: <FontAwesome5 name='tools' size={24} color='#004A99' />,
    },
    {
      color: '#F39200',
      name_fase: 'PDI',
      completed: 50,
      total: 61,
      iconName: <FontAwesome5 name='car' size={24} color='#F39200' />,
    },
  ];

  if (!isLoggedIn) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
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

        <View style={styles.container}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* TODO: Traer esta información de la BD */}
            {fases.map((item, index) => (
              <CardFase
                key={item.name_fase + index}
                color={item.color}
                name_fase={item.name_fase}
                completed={item.completed}
                total={item.total}
                icon={item.iconName}
              />
            ))}
          </ScrollView>

          <TableInspection />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  container: {
    paddingVertical: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
});

