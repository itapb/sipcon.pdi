import { CardCar } from '@/components/card/CardCar';
import { InspectionFeature } from '@/components/features/InspectionFeature';
import { MenuHeader } from '@/layout/MenuHeader';
import { Link, useLocalSearchParams } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function InspectionScreen() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Encabezado fijo */}
        <MenuHeader />

        {/* BreadCrumbs fijos */}
        <View style={styles.breadCrumbs}>
          <View style={styles.breadCrumbsTexts}>
            <Link href={'/'} asChild>
              <TouchableOpacity>
                <Text style={styles.text}>Inicio {'> '}</Text>
              </TouchableOpacity>
            </Link>
            <Text style={[styles.text, styles.text_fase]}>Fase</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.red]}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Cerrar inspección</Text>
          </TouchableOpacity>
        </View>

        {/* Área con Scroll */}
        <CardCar
          model_name='Changan CS15'
          vin={1234567890}
          plate='ABC-123'
          imageSource={require('../../assets/images/carros/FotoAuto.png')}
        />

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Listado de preguntas */}
          <InspectionFeature
            feature='¿El VIN del auto coincide con la documentación?'
            fileCount={1}
          />
          <InspectionFeature
            feature='Estado de la pintura y carrocería (¿Hay abolladuras?)'
            fileCount={3}
          />
          <InspectionFeature
            feature='Verificación de kit de herramientas y llanta de repuesto'
            fileCount={0}
          />
          <InspectionFeature
            feature='Funcionamiento de luces (Altas, bajas y frenos)'
            fileCount={2}
          />
          <InspectionFeature
            feature='Limpieza de interiores y estado de la tapicería'
            fileCount={1}
          />

          <View style={{ height: 30 }} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  scrollContent: {
    paddingVertical: 10,
  },
  breadCrumbs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 55,
    backgroundColor: '#fff',
    borderColor: '#E2E8F0',
    borderBottomWidth: 1,
    zIndex: 10,
  },
  breadCrumbsTexts: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#64748B',
    fontSize: 15,
  },
  text_fase: {
    color: '#0C8CE9',
    fontWeight: '600',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  red: {
    backgroundColor: '#FF383C',
  },
});
