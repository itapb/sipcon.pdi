import { CardFase } from '@/components/card/CardFase';
import { LoadingScreen } from '@/components/loading/LoadingScreen';
import { TableInspection } from '@/components/tables/TableInspection';
import { HookInspections } from '@/hooks/HookInspections';
import { FooterMain } from '@/layout/FooterMain';
import { MenuHeader } from '@/layout/MenuHeader';
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { faseId = 0 as any } = useLocalSearchParams();

  // TODO: Falta el manejo de los errores y la carga
  const {
    fases,
    inspections,
    loading,
    isLoggedIn,
    GetInfoPage,
    user,
    areas,
    selectedArea,
  } = HookInspections();

  useEffect(() => {
    if (isLoggedIn) {
      if (!inspections) {
        GetInfoPage({ areaId: selectedArea! });
      }
    }
  }, [isLoggedIn, GetInfoPage, inspections]);

  if (!isLoggedIn) return null;
  if (!inspections || !fases) return <Text>No hay datos</Text>;

  const ManualRefresh = () => {
    GetInfoPage({ areaId: selectedArea! });
  };

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
          {fases.map(
            (item, index) =>
              areas?.some((areaItem) => areaItem.id === item.faseId) && (
                <CardFase
                  key={index + item.name_fase}
                  color={'green'}
                  name_fase={item.name_fase}
                  completed={item.completed}
                  total={item.total}
                  faseId={item.faseId}
                  selectedFaseId={faseId}
                  icon={<AntDesign name='check' size={24} color='#16A34A' />}
                />
              ),
          )}
        </ScrollView>

        {/* Datatable */}
        <TableInspection
          Inspections={inspections}
          fases={fases}
          filterFaseId={faseId}
        />
      </View>

      <FAB
        icon='refresh'
        style={styles.fab}
        onPress={ManualRefresh}
        loading={loading}
        color='white'
      />

      <FooterMain
        areaId={selectedArea!}
        token={user!.token}
        userId={user!.userId}
      />
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
