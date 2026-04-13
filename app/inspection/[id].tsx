import { AccordionObservation } from '@/components/Accordion/AccordionObservation';
import { BreadCrumbInspection } from '@/components/breadcrumb/BreadCrumbInspection';
import { CardCar } from '@/components/card/CardCar';
import { ListFeatures } from '@/components/features/ListFeatures';
import { LoadingScreen } from '@/components/loading/LoadingScreen';
import { GetInspectionData } from '@/hooks/HookGetInspectionDetail';
import { FooterInspections } from '@/layout/FooterInspections';
import { MenuHeader } from '@/layout/MenuHeader';
import { useAuthStore } from '@/store/useAuthStore';
import { useInspectionStore } from '@/store/useInspectionStore';
import { DataInspectionDetail } from '@/utils/fetchs/inspections/GET_InspectionDetailt';
import { DataInspectionFase } from '@/utils/fetchs/inspections/GET_InspectionFase';
import { GroupFeaturesByType } from '@/utils/GroupFeaturesByType';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function InspectionScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuthStore();

  const router = useRouter();
  const setNeedsRefresh = useInspectionStore((state) => state.setNeedsRefresh);

  const [activeFase, setActiveFase] = useState(0);
  const [observation, setObservation] = useState('');
  const [inspectionDetail, setinspectionDetail] = useState<
    DataInspectionDetail[]
  >([]);
  const [inspectionFase, setInspectionFase] = useState<DataInspectionFase[]>(
    [],
  );
  const [showObservation, setShowObservation] = useState(false);

  // TODO: Esto está pendiente por aplicar
  const UpdateAndGoBack = () => {
    setNeedsRefresh(true);
    router.back();
  };

  useEffect(() => {
    GetInspectionData(+id, user!.token, setinspectionDetail, setInspectionFase);
  }, [id, user]);

  const inspectionGroup = GroupFeaturesByType(inspectionDetail);

  useEffect(() => {
    if (inspectionGroup.length > 0 && activeFase === 0) {
      // Seteamos la primera fase disponible como activa
      const initialFaseId = inspectionGroup[0].faseId;
      if (initialFaseId !== undefined) {
        setActiveFase(initialFaseId);
      }
    }
  }, [inspectionGroup]);

  const filteredGroups = inspectionGroup
    .filter((group) => group.faseId === inspectionGroup[0].faseId)
    .filter((g) => g !== null);

  if (!inspectionDetail.length)
    return <LoadingScreen visible={true} message='Obteniendo información' />;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <MenuHeader />
        {/* BreadCrumbs fijos */}
        <View style={styles.mainContent}>
          <BreadCrumbInspection />

          {/* Información rápida de la unidad */}
          <CardCar
            model_name='Changan CS15'
            vin={1234567890}
            plate='ABC-123'
            imageSource={require('../../assets/images/carros/FotoAuto.png')}
          />

          {/* Observaciones Generales */}
          <AccordionObservation
            observation={observation}
            setObservation={setObservation}
            showObservation={showObservation}
            setShowObservation={setShowObservation}
          />

          {/* Lista de features */}
          <ListFeatures Groups={filteredGroups} />

          {/* Footer con Carrusel Horizontal */}
          <FooterInspections
            fases={inspectionFase}
            activePhase={activeFase}
            onPhaseChange={setActiveFase}
          />
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
  mainContent: {
    flex: 1,
    paddingBottom: 80,
  },
});
