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
import { DataInspectionById } from '@/utils/fetchs/inspections/GET_InspectionById';
import { DataInspectionDetail } from '@/utils/fetchs/inspections/GET_InspectionDetailt';
import { DataInspectionFase } from '@/utils/fetchs/inspections/GET_InspectionFase';
import { GroupFeaturesByType } from '@/utils/GroupFeaturesByType';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function InspectionScreen() {
  const { id } = useLocalSearchParams();
  const { user, isLoggedIn } = useAuthStore();

  const router = useRouter();
  const setNeedsRefresh = useInspectionStore((state) => state.setNeedsRefresh);

  const [hasError, setHasError] = useState(false);
  const [activeFase, setActiveFase] = useState(0);
  const [observation, setObservation] = useState('');
  const [inspection, setInspection] = useState<DataInspectionById>();
  const [inspectionDetail, setinspectionDetail] = useState<
    DataInspectionDetail[]
  >([]);
  const [inspectionFase, setInspectionFase] = useState<DataInspectionFase[]>(
    [],
  );

  const [showObservation, setShowObservation] = useState(false);
  const [isItStarted, setIsItStarted] = useState(false);

  const UpdateMenu = () => {
    setNeedsRefresh(true);
  };

  const inspectionGroup = GroupFeaturesByType(inspectionDetail);
  useEffect(() => {
    if (!user?.token || !isLoggedIn) return;

    const loadData = async () => {
      try {
        await GetInspectionData(
          +id,
          user.token,
          setinspectionDetail,
          setInspectionFase,
          setInspection,
          setIsItStarted,
        );
      } catch (error: any) {
        setHasError(true);
        Alert.alert(
          'Error de Carga',
          error.message ||
            'No se pudo obtener la información de la inspección.',
          [{ text: 'OK', onPress: () => router.back() }],
        );
      }
    };

    loadData();
  }, [id, user?.token, isLoggedIn]);

  useEffect(() => {
    if (inspectionGroup.length > 0 && activeFase === 0) {
      // Seteamos la primera fase disponible como activa
      const initialFaseId = inspectionGroup[0].faseId;
      if (initialFaseId !== undefined) {
        setActiveFase(initialFaseId);
      }
    }
  }, [inspectionGroup, activeFase]);

  const filteredGroups = inspectionGroup
    .filter((group) => group.faseId === inspectionGroup[0].faseId)
    .filter((g) => g !== null);

  if (hasError) return <Text> Error</Text>; // Un componente simple para reintentar
  if (!inspectionDetail.length || !inspection || !inspectionFase.length)
    return <LoadingScreen visible={true} message='Obteniendo información' />;

  const InspectionFaseActived = inspectionFase.find(
    (item) => item.faseId == activeFase,
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <MenuHeader />
        {/* BreadCrumbs fijos */}
        <View style={styles.mainContent}>
          <BreadCrumbInspection
            isItStarted={isItStarted}
            token={user!.token}
            inspectionId={+id}
            areaId={inspection.areaId}
            vehicleId={inspection.vehicleId}
            createdBy={inspection.createdBy}
            UpdateMenu={UpdateMenu}
            setIsItStarted={setIsItStarted}
            InspectionFaseId={InspectionFaseActived?.id ?? 0}
            faseId={activeFase}
            faseCompleted={InspectionFaseActived?.isCompleted ?? 0}
          />

          {/* Información rápida de la unidad */}
          <CardCar
            model_name={inspection.model}
            vin={inspection.vin}
            plate={inspection.vehiclePlate}
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
          <ListFeatures
            Groups={filteredGroups}
            token={user!.token}
            readOnly={!isItStarted || !!InspectionFaseActived?.isCompleted}
          />

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
