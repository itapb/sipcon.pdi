import { LoadingScreen } from '@/components/loading/LoadingScreen';
import { FooterInspections } from '@/layout/FooterInspections';
import { MenuHeader } from '@/layout/MenuHeader';
import { DataAreas } from '@/utils/fetchs/Areas/Get_Areas';
import { DataInspectionById } from '@/utils/fetchs/inspections/GET_InspectionById';
import { DataInspectionDetail } from '@/utils/fetchs/inspections/GET_InspectionDetailt';
import { DataInspectionFase } from '@/utils/fetchs/inspections/GET_InspectionFase';
import React, { Dispatch, SetStateAction } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BreadCrumbInspection } from '../breadcrumb/BreadCrumbInspection';
import { Inspection } from './Inspection';
import { RestrictedAccess } from './RestrictedAccess';

type InspectionContentProps = {
  id: number;
  activedFase: DataInspectionFase | null | undefined;
  areas: DataAreas[] | null;
  canEditFase: boolean;
  error: string | null;
  faseId: number;
  groups: any[];
  hasPermission: boolean;
  inspection: DataInspectionById | null;
  inspectionDetail: DataInspectionDetail[];
  inspectionFase: DataInspectionFase[];
  load: boolean;
  observation: string;
  setObservation: Dispatch<SetStateAction<string>>;
  setShowObservation: Dispatch<SetStateAction<boolean>>;
  showObservation: boolean;
  userId: number;
  onUpdateQuestionLocal: (
    idDetail: number,
    newValue: number | null,
    newObs: string,
  ) => void;
};

export function InspectionContent(props: InspectionContentProps) {
  // --- 1. Control de pantallas de carga tempranas ---
  if (props.load && (!props.inspectionDetail.length || !props.inspection)) {
    return <LoadingScreen visible={true} message='Obteniendo información...' />;
  }

  // --- 2. Validaciones o captura de errores ---
  if (props.error && !props.inspection) {
    return (
      <View style={styles.centerWrapper}>
        <Text style={styles.errorText}>{props.error}</Text>
      </View>
    );
  }

  if (
    !props.inspectionDetail.length ||
    !props.inspection ||
    !props.inspectionFase.length
  ) {
    return <LoadingScreen visible={true} message='Procesando datos...' />;
  }

  if (!props.activedFase) {
    return (
      <View style={styles.centerWrapper}>
        <Text style={styles.centerText}>
          No hay Fases disponibles para esta unidad.
        </Text>
      </View>
    );
  }

  // Variable calculada para controlar la edición global en los sub-componentes
  const isReadOnly =
    !props.activedFase.initDate || !!props.activedFase.isCompleted;

  // --- 4. El esqueleto visual definitivo ---
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <MenuHeader />

        <View style={styles.mainContent}>
          {/* Componente de navegación y también para iniciar las fases */}
          <BreadCrumbInspection
            faseCompleted={
              !!props.activedFase.isCompleted || !props.hasPermission
            }
            faseId={props.faseId}
            InspectionFaseId={props.activedFase.id}
            inspectionId={props.id}
            isItStarted={!!props.activedFase.initDate || !props.hasPermission}
            userId={props.userId}
          />

          {/* Renderizado condicional basado en las reglas de negocio calculadas arriba */}
          {props.hasPermission ? (
            <Inspection
              id={props.id}
              groups={props.groups}
              inspection={props.inspection}
              isReadOnly={isReadOnly}
              observation={props.observation}
              setObservation={props.setObservation}
              setShowObservation={props.setShowObservation}
              showObservation={props.showObservation}
              userId={props.userId}
              onUpdateQuestionLocal={props.onUpdateQuestionLocal}
            />
          ) : (
            <RestrictedAccess />
          )}

          {/* Navegador horizontal de fases */}
          <FooterInspections
            fases={props.inspectionFase}
            activePhase={props.faseId}
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
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  centerText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
});
