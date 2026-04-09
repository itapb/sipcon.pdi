import { CardCar } from '@/components/card/CardCar';
import { InspectionFeature } from '@/components/features/InspectionFeature';
import { inspectionGroups } from '@/constants/DataInspectionDetail';
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

        {/* Información rápida de la unidad */}
        <CardCar
          model_name='Changan CS15'
          vin={1234567890}
          plate='ABC-123'
          imageSource={require('../../assets/images/carros/FotoAuto.png')}
        />

        {/* Lista de features */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {inspectionGroups.map((group, index) => (
            <View key={index} style={styles.groupContainer}>
              {/* Título del Grupo */}
              <Text style={styles.groupTitle}>{group.title}</Text>

              {/* Listado de Preguntas del Grupo */}
              {group.questions.map((q) => (
                <InspectionFeature
                  key={q.id}
                  feature={q.text}
                  fileCount={q.files}
                />
              ))}
            </View>
          ))}

          <View style={{ height: 40 }} />
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
  groupContainer: {
    marginBottom: 20, // Espacio entre grupos
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#94A3B8', // Un gris azulado elegante
    textTransform: 'uppercase', // Estilo de sección profesional
    letterSpacing: 1,
    marginLeft: 20,
    marginBottom: 8,
    marginTop: 10,
  },
});
