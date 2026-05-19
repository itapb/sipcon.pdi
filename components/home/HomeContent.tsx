import { FooterMain } from '@/layout/FooterMain';
import { MenuHeader } from '@/layout/MenuHeader';
import { DataInspection } from '@/utils/fetchs/inspections/GET_Inspections';
import { T_GroupInspectionsFase } from '@/utils/GroupInspectionsByFase';
import { StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorHome } from '../error/ErrorHome';
import { ContainerFases } from '../fases/ContainerFases';
import { LoadingScreen } from '../loading/LoadingScreen';
import { TableInspection } from '../tables/TableInspection';

type Props = {
  faseId: number;
  fases: T_GroupInspectionsFase[] | null;
  inspections: DataInspection[] | null;
  loading: boolean;
  error: string | null;
  areas: any[] | null;
  selectedArea: number | null;
  selectedSupplier: number | null;
  user: any;
  ManualRefresh: () => void;
};

export const HomeContent = (props: Props) => {
  // 1. Estado de error crítico
  if (props.error && !props.inspections && !props.fases) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ErrorHome
          ManualRefresh={props.ManualRefresh}
          error={props.error}
          loading={props.loading}
        />
      </SafeAreaView>
    );
  }

  // 2. Carga inicial completa
  if (props.loading && !props.inspections && !props.fases) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <LoadingScreen
          visible={true}
          message='Cargando inspecciones asignadas...'
        />
      </SafeAreaView>
    );
  }

  // 3. VALIDACIÓN ANTICIPADA DE DATA: Si el API respondió ok pero las listas vienen nulas/indefinidas
  if (!props.inspections || !props.fases) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <LoadingScreen
          visible={true}
          message='Preparando datos de las unidades...'
        />
      </SafeAreaView>
    );
  }

  // RETORNO PRINCIPAL: Aquí garantizamos al 100% que la data existe
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LoadingScreen visible={props.loading} message='Actualizando...' />

      <MenuHeader />

      <View style={styles.mainContent}>
        <View style={styles.container}>
          <ContainerFases
            areas={props.areas}
            faseId={props.faseId}
            fases={props.fases}
          />

          <TableInspection
            Inspections={props.inspections}
            fases={props.fases}
            filterFaseId={props.faseId}
          />
        </View>
      </View>

      <FAB
        icon='refresh'
        style={styles.fab}
        onPress={props.ManualRefresh}
        loading={props.loading}
        color='white'
      />

      <FooterMain
        key={`footer-${props.selectedArea}-${props.selectedSupplier}`}
        supplierId={props.selectedSupplier ?? 0}
        areaId={props.selectedArea ?? 0}
        areas={props.areas ?? []}
        token={props.user?.token ?? ''}
        userId={props.user?.userId ?? 0}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  mainContent: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 15,
  },
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 100,
    width: 55,
    height: 55,
    backgroundColor: '#2196F3',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
