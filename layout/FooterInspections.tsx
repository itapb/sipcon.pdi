import { DataInspectionFase } from '@/utils/fetchs/inspections/GET_InspectionFase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { type FC, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  fases: DataInspectionFase[];
  activePhase: number;
}

export const FooterInspections: FC<Props> = ({ fases, activePhase }) => {
  const router = useRouter();
  const pathname = usePathname();

  const insets = useSafeAreaInsets();

  // Memorizamos la función de color para evitar cálculos en el render
  const getStatusColor = useCallback((isDone: boolean, isActive: boolean) => {
    if (isDone) return '#22C55E';
    if (isActive) return '#3B82F6';
    return '#94A3B8';
  }, []);
  return (
    <View
      style={[
        styles.fixedFooter,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {fases.map((phase) => {
          // Aseguramos comparación numérica
          const isActive = Number(activePhase) === Number(phase.faseId);
          const isDone = !!phase.isCompleted;
          const currentColor = getStatusColor(isDone, isActive);

          return (
            <TouchableOpacity
              key={`fase-${phase.faseId}-${phase.id}`} // Key más único
              style={styles.footerButton}
              onPress={() =>
                router.replace({
                  pathname: pathname as any, // o el 'pathname' que ya tienes
                  params: { faseId: phase.faseId }, // Aquí agregas tus parámetros
                })
              }
              activeOpacity={0.7}
            >
              <View style={styles.contentWrapper}>
                {isDone && (
                  <MaterialCommunityIcons
                    name='check-circle'
                    size={12}
                    color='#22C55E'
                    style={styles.checkIcon}
                  />
                )}

                <Text
                  style={[
                    styles.footerButtonText,
                    { color: currentColor },
                    isActive && styles.textActive,
                  ]}
                >
                  {phase.fase.toUpperCase()}
                </Text>
              </View>

              {isActive && (
                <View
                  style={[
                    styles.activeIndicator,
                    { backgroundColor: currentColor },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    minHeight: 65,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    height: 60,
    alignItems: 'center',
  },
  footerButton: {
    height: '100%',
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: 4,
  },
  footerButtonText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textActive: {
    fontWeight: '900',
    fontSize: 11,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 24,
    height: 3,
    borderRadius: 2,
  },
});
