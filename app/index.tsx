import { CardFase } from '@/components/card/CardFase';
import { TableInspection } from '@/components/tables/TableInspection';
import { HookInspections } from '@/hooks/HookInspections';
import { FooterMain } from '@/layout/FooterMain';
import { MenuHeader } from '@/layout/MenuHeader';
import { useAuthStore } from '@/store/useAuthStore';
import { AntDesign } from '@expo/vector-icons';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { isLoggedIn } = useAuthStore();

  // TODO: Falta el manejo de los errores y la carga
  const { fases, GetFasesByArea } = HookInspections();

  useEffect(() => {
    if (isLoggedIn) {
      GetFasesByArea(1); // Llamamos a la función con el areaId
    }
  }, [isLoggedIn, GetFasesByArea]);

  if (!isLoggedIn) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Cabecera del menú */}
        <MenuHeader />

        {/* Cards de las fases */}
        <View style={styles.container}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* // TODO: Traer esta información de la BD */}
            {fases.map((item, index) => (
              <CardFase
                key={index + item.name_fase}
                color={'green'}
                name_fase={item.name_fase}
                completed={item.completed}
                total={item.total}
                // TODO: Mejorar esto
                icon={<AntDesign name='check' size={24} color='#16A34A' />}
              />
            ))}
          </ScrollView>

          {/* Datatable */}
          <TableInspection />
        </View>

        <FooterMain />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  container: {
    paddingVertical: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
});

