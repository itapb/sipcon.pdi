import { BreadCrumbInspection } from '@/components/breadcrumb/BreadCrumbInspection';
import { LoadingScreen } from '@/components/loading/LoadingScreen';
import { FooterInspections } from '@/layout/FooterInspections';
import { MenuHeader } from '@/layout/MenuHeader';
import { DataAreas } from '@/utils/fetchs/Areas/Get_Areas';
import { DataInspectionById } from '@/utils/fetchs/inspections/GET_InspectionById';
import { DataInspectionDetail } from '@/utils/fetchs/inspections/GET_InspectionDetailt';
import { DataInspectionFase } from '@/utils/fetchs/inspections/GET_InspectionFase';
import { DataUser } from '@/utils/fetchs/login/POST_Login';
import React, { Dispatch, SetStateAction } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Inspection } from './Inspection';
import { RestrictedAccess } from './RestrictedAccess';

// Declaramos los tipos exactos de todas las propiedades que le manda el controlador
type InspectionContentProps = {
  id: number;
  activedFase: DataInspectionFase | null | undefined;
  areas: DataAreas[] | null;
  canEditFase: boolean;
  error: string | null;
  faseId: number;
  groups: any[];
  hasPermission: boolean;
  inspection: DataInspectionById | null; // Reemplaza con DataInspectionById
  inspectionDetail: DataInspectionDetail[]; // Reemplaza con DataInspectionDetail[]
  inspectionFase: DataInspectionFase[]; // Reemplaza con DataInspectionFase[]
  load: boolean;
  observation: string;
  setObservation: Dispatch<SetStateAction<string>>;
  setShowObservation: Dispatch<SetStateAction<boolean>>;
  showObservation: boolean;
  user: DataUser | null; // Reemplaza con tu tipo de usuario real si lo tienes
};

export function InspectionContent({
  id,
  faseId,
  load,
  error,
  user,
  observation,
  setObservation,
  showObservation,
  setShowObservation,
  inspection,
  inspectionDetail,
  inspectionFase,
  groups,
  activedFase,
  hasPermission,
}: InspectionContentProps) {
  // --- 1. Control de pantallas de carga tempranas ---
  if (load && (!inspectionDetail.length || !inspection)) {
    return <LoadingScreen visible={true} message='Obteniendo información...' />;
  }

  // --- 2. Validaciones de contingencia de datos ---
  if (error && !inspection) {
    return (
      <View style={styles.centerWrapper}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!inspectionDetail.length || !inspection || !inspectionFase.length) {
    return <LoadingScreen visible={true} message='Procesando datos...' />;
  }

  if (!activedFase) {
    return (
      <View style={styles.centerWrapper}>
        <Text style={styles.centerText}>
          No hay Fases disponibles para esta unidad.
        </Text>
      </View>
    );
  }

  // Variable calculada para controlar la edición global en los sub-componentes
  const isReadOnly = !activedFase.initDate || !!activedFase.isCompleted;

  // --- 4. El esqueleto visual definitivo ---
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <MenuHeader />

        <View style={styles.mainContent}>
          {/* Componente de navegación y tambien para iniciar las fases */}
          <BreadCrumbInspection
            isItStarted={!!activedFase.initDate || !hasPermission}
            token={user!.token}
            userId={user!.userId}
            inspectionId={id}
            InspectionFaseId={activedFase.id}
            faseId={faseId}
            faseCompleted={!!activedFase.isCompleted || !hasPermission}
          />

          {/* Renderizado condicional basado en las reglas de negocio calculadas arriba */}
          {hasPermission ? (
            <Inspection
              groups={groups}
              id={id}
              inspection={inspection}
              isReadOnly={isReadOnly}
              observation={observation}
              setObservation={setObservation}
              setShowObservation={setShowObservation}
              showObservation={showObservation}
              user={user}
            />
          ) : (
            <RestrictedAccess />
          )}

          {/* Navegador horizontal de fases */}
          <FooterInspections fases={inspectionFase} activePhase={faseId} />
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
