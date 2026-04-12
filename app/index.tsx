import { CardFase } from '@/components/card/CardFase';
import { LoadingScreen } from '@/components/loading/LoadingScreen';
import { TableInspection } from '@/components/tables/TableInspection';
import { HookInspections } from '@/hooks/HookInspections';
import { FooterMain } from '@/layout/FooterMain';
import { MenuHeader } from '@/layout/MenuHeader';
import { useAuthStore } from '@/store/useAuthStore';
import { AntDesign } from '@expo/vector-icons';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { isLoggedIn } = useAuthStore();

  // TODO: Falta el manejo de los errores y la carga
  const {
    fases,
    inspections,
    loading,
    GetInfoPage,
    setNeedsRefresh,
    needsRefresh,
  } = HookInspections();

  useEffect(() => {
    if (isLoggedIn) {
      // Cargamos si es la primera vez O si alguien activó el refresh global
      if (!inspections.length || needsRefresh) {
        GetInfoPage({ areaId: 1, forceRefresh: !!needsRefresh });

        // Importante: Bajamos la bandera una vez que iniciamos la carga
        if (needsRefresh) setNeedsRefresh(false);
      }
    }
  }, [isLoggedIn, needsRefresh, GetInfoPage]);

  const ManualRefresh = () => {
    GetInfoPage({ areaId: 1, forceRefresh: true });
  };

  if (!isLoggedIn) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Componente de carga */}
      <LoadingScreen visible={loading} message='Actualizando Inspecciones...' />

      {/* Cabecera del menú */}
      <MenuHeader />

      {/* Cards de las fases */}
      <View style={styles.container}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
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
        <TableInspection Inspections={inspections} />
      </View>

      <FAB
        icon='refresh'
        style={styles.fab}
        onPress={ManualRefresh}
        loading={loading}
        color='white'
      />

      <FooterMain />
    </SafeAreaView>
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
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 100,
    width: 55,
    height: 55,
    backgroundColor: '#2196F3',
    borderRadius: 50,
  },
});

