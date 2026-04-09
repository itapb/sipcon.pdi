import { CardFase } from '@/components/card/CardFase';
import { TableInspection } from '@/components/tables/TableInspection';
import { fases } from '@/constants/DataFase';
import { FooterMain } from '@/layout/FooterMain';
import { MenuHeader } from '@/layout/MenuHeader';
import { useAuthStore } from '@/store/useAuthStore';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { isLoggedIn } = useAuthStore();

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

