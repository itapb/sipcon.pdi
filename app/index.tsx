import { CardFase } from '@/components/card/CardFase';
import { TableInspection } from '@/components/tables/TableInspection';
import { MenuHeader } from '@/layout/MenuHeader';
import { useAuthStore } from '@/store/useAuthStore';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';
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
        {/* Cabecera del menú */}
        <MenuHeader />

        {/* Cards de las fases */}
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

          {/* Datatable */}
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
  container: {
    paddingVertical: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
});

