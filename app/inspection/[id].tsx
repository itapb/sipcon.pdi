import { AccordionObservation } from '@/components/Accordion/AccordionObservation';
import { BreadCrumbInspection } from '@/components/breadcrumb/BreadCrumbInspection';
import { CardCar } from '@/components/card/CardCar';
import { ListFeatures } from '@/components/features/ListFeatures';
import { DATAFASES } from '@/constants/DataFases';
import { INSPECTIONGROUPS } from '@/constants/DataInspectionDetail';
import { FooterInspections } from '@/layout/FooterInspections';
import { MenuHeader } from '@/layout/MenuHeader';
import { useInspectionStore } from '@/store/useInspectionStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function InspectionScreen() {
  const { id } = useLocalSearchParams();

  const router = useRouter();
  const setNeedsRefresh = useInspectionStore((state) => state.setNeedsRefresh);

  const [activePhase, setActivePhase] = useState(DATAFASES[0].id);
  const [observation, setObservation] = useState('');

  // Estado para controlar la visibilidad del acordeón
  const [showObservation, setShowObservation] = useState(false);

  const filteredGroups = INSPECTIONGROUPS.filter(
    (group) => group.phaseId === activePhase,
  ).filter((g) => g !== null);

  const handleUpdateAndGoBack = () => {
    // 1. Levantamos la bandera
    setNeedsRefresh(true);

    // 2. Regresamos al Home (la navegación es inmediata y sin errores)
    router.back();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <MenuHeader />
        {/* BreadCrumbs fijos */}
        <View style={styles.mainContent}>
          <BreadCrumbInspection />

          <TouchableOpacity onPress={handleUpdateAndGoBack}>
            <Text style={{ color: '#2196F3', fontWeight: 'bold' }}>
              ACTUALIZAR Y VOLVER
            </Text>
          </TouchableOpacity>

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
            phases={DATAFASES}
            activePhase={activePhase}
            onPhaseChange={setActivePhase}
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
