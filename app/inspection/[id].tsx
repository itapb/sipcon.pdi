import { AccordionObservation } from '@/components/Accordion/AccordionObservation';
import { BreadCrumbInspection } from '@/components/breadcrumb/BreadCrumbInspection';
import { CardCar } from '@/components/card/CardCar';
import { ListFeatures } from '@/components/features/ListFeatures';
import { LoadingScreen } from '@/components/loading/LoadingScreen';
import { FooterInspections } from '@/layout/FooterInspections';
import { MenuHeader } from '@/layout/MenuHeader';
import { useAuthStore } from '@/store/useAuthStore';
import {
  DataInspectionById,
  GET_InspectionById,
} from '@/utils/fetchs/inspections/GET_InspectionById';
import {
  DataInspectionDetail,
  GET_InspectionDetails,
} from '@/utils/fetchs/inspections/GET_InspectionDetailt';
import {
  DataInspectionFase,
  GET_InspectionsFases,
} from '@/utils/fetchs/inspections/GET_InspectionFase';
import { GroupFeaturesByType } from '@/utils/GroupFeaturesByType';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  inspectionId: number;
  faseId: number;
};

export default function InspectionScreen() {
  const { id, faseId } = useLocalSearchParams();
  const { user, isLoggedIn, areas } = useAuthStore();

  // --- Estados de Control ---
  const [load, setLoad] = useState(false);
  const [error2, setError2] = useState<string | null>(null);

  const [observation, setObservation] = useState<string>('');
  const [showObservation, setShowObservation] = useState<boolean>(false);

  const [inspection, setInspection] = useState<DataInspectionById | null>(null);
  const [inspectionDetail, setInspectionDetail] = useState<
    DataInspectionDetail[]
  >([]);
  const [inspectionFase, setInspectionFase] = useState<DataInspectionFase[]>(
    [],
  );

  const GetInfoPageInspection = async (props: Props) => {
    // Usamos el token directamente del store de forma segura
    if (!user?.token) return;

    setLoad(true);
    setError2(null);

    try {
      const [rawDetail, rawFases, rawInspection] = await Promise.all([
        GET_InspectionDetails({
          inspectionId: props.inspectionId,
          faseId: props.faseId,
          token: user.token,
        }),
        GET_InspectionsFases({
          inspectionId: props.inspectionId,
          token: user.token,
          Completed: false,
        }),
        GET_InspectionById({
          inspectionId: props.inspectionId,
          token: user.token,
        }),
      ]);
      // Mantenemos la data previa si la nueva viene vacía (como en tu otro hook)
      let finalInspection = inspection;
      let finalDetail = inspectionDetail;
      let finalFases = inspectionFase;
      if (rawInspection) finalInspection = rawInspection;
      if (rawDetail) finalDetail = rawDetail;
      if (rawFases) finalFases = rawFases;
      setInspection(finalInspection);
      setInspectionDetail(finalDetail);
      setInspectionFase(finalFases);
    } catch (err) {
      const mensaje = `Error obteniendo detalles de inspección: ${err}`;
      console.error(mensaje);
      setError2('No se pudo cargar la información detallada de la inspección.');
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    // Si no está logueado retorna a 0
    if (isLoggedIn) {
      if (!inspectionDetail?.length || !inspection || !inspectionFase.length) {
        GetInfoPageInspection({ inspectionId: +id, faseId: +faseId });
      }
    }
  }, []);

  if (!isLoggedIn) return null;
  if (!inspectionDetail.length || !inspection || !inspectionFase.length)
    return <LoadingScreen visible={true} message='Obteniendo información' />;

  const groups = GroupFeaturesByType(inspectionDetail || []);

  const activedFase = inspectionFase.find(
    (item) => item.faseId === +faseId && item.inspectionId === +id,
  );

  if (!activedFase) return <Text>No hay Fases</Text>;

  const hasPermission = areas?.some((item) => item.id == activedFase.faseId);

  // Falta esos permisos
  const canEditFase = inspectionFase.some(
    (item) => item.faseId === activedFase.faseId && !item.initDate,
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <MenuHeader />
        {/* BreadCrumbs fijos */}
        <View style={styles.mainContent}>
          <BreadCrumbInspection
            isItStarted={!!activedFase.initDate || !hasPermission}
            token={user!.token}
            userId={user!.userId}
            inspectionId={+id}
            InspectionFaseId={activedFase.id} // traer la fase la cual estoy posicionado
            faseId={+faseId}
            faseCompleted={!!activedFase.isCompleted || !hasPermission} // traer si esa fase está completada
          />

          {/* Lista de features */}
          {!hasPermission ? (
            <View style={styles.alertContainer}>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                  name='shield-lock-outline'
                  size={28}
                  color='#E11D48'
                />
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.alertTitle}>Acceso Restringido</Text>
                <Text style={styles.alertSubtitle}>
                  No tienes los permisos necesarios para modificar esta
                  inspección. Contacta con tu supervisor.
                </Text>
              </View>
            </View>
          ) : (
            <>
              {/* Información rápida de la unidad */}
              <CardCar
                model_name={inspection.model}
                vin={inspection.vin}
                plate={inspection.vehiclePlate}
                imageSource={require('../../assets/images/carros/FotoAuto.png')}
                inspectionId={+id}
                token={user!.token}
                userId={user!.userId}
                readOnly={!activedFase.initDate || !!activedFase.isCompleted} // Ver si esta inspección se puede iniciar
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
                userId={user!.userId}
                Groups={groups} // traer los grupos
                token={user!.token}
                readOnly={!activedFase.initDate || !!activedFase.isCompleted}
              />
            </>
          )}

          {/* Footer con Carrusel Horizontal */}

          <FooterInspections fases={inspectionFase} activePhase={+faseId} />
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
  mainWrapper: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  alertContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF1F2', // Rojo muy tenue
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECDD3',
    alignItems: 'center',
    marginVertical: 10,
  },
  iconWrapper: {
    backgroundColor: '#FFE4E6',
    padding: 10,
    borderRadius: 10,
    marginRight: 14,
  },
  textWrapper: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9F1239', // Rojo oscuro elegante
    marginBottom: 2,
  },
  alertSubtitle: {
    fontSize: 13,
    color: '#BE123C',
    lineHeight: 18,
    opacity: 0.8,
  },
});
