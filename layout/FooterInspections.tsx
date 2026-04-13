import { DataInspectionFase } from '@/utils/fetchs/inspections/GET_InspectionFase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type FC } from 'react';
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
  onPhaseChange: (faseId: number) => void;
}

export const FooterInspections: FC<Props> = ({
  fases,
  activePhase,
  onPhaseChange,
}) => {
  console.log({ activePhase });

  const insets = useSafeAreaInsets();

  const getStatusColor = (isDone: boolean, isActive: boolean) => {
    if (isDone) return '#22C55E'; // Verde Esmeralda
    if (isActive) return '#3B82F6'; // Azul
    return '#94A3B8'; // Gris Slate
  };

  return (
    <View
      style={[
        styles.fixedFooter,
        {
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false} //
        contentContainerStyle={styles.scrollContainer}
      >
        {fases.map((phase) => {
          const isActive = +activePhase === phase.faseId;
          const isDone = !!phase.isCompleted;

          getStatusColor(isDone, isActive);

          return (
            <TouchableOpacity
              key={phase.id}
              style={styles.footerButton}
              onPress={() => onPhaseChange(phase.faseId)}
              activeOpacity={0.7}
            >
              <View style={styles.contentWrapper}>
                {/* Icono de check si está completo */}
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
                    { color: getStatusColor(isDone, isActive) },
                    isActive && styles.textActive,
                    !isDone && !isActive && { color: '#EF4444' }, // Opcional: Rojo si no está listo
                  ]}
                >
                  {phase.fase.toUpperCase()}
                </Text>
              </View>

              {/* Indicador inferior dinámico */}
              {isActive && (
                <View
                  style={[
                    styles.activeIndicator,
                    { backgroundColor: getStatusColor(isDone, isActive) },
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
