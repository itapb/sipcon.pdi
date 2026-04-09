import { type FC } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export interface PhaseItem {
  id: string;
  label: string;
}

interface Props {
  phases: PhaseItem[];
  activePhase: string;
  onPhaseChange: (phaseId: string) => void;
}

export const FooterInspections: FC<Props> = ({
  phases,
  activePhase,
  onPhaseChange,
}) => {
  return (
    <View style={styles.fixedFooter}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {phases.map((phase) => {
          const isActive = activePhase === phase.id;

          return (
            <TouchableOpacity
              key={phase.id}
              style={styles.footerButton}
              onPress={() => onPhaseChange(phase.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.footerButtonText, isActive && styles.textActive]}
              >
                {phase.label.toUpperCase()}
              </Text>

              {/* Indicador inferior (Línea azul) */}
              {isActive && <View style={styles.activeIndicator} />}
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

    height: 60,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',

    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    paddingBottom: Platform.OS === 'ios' ? 15 : 0,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  footerButton: {
    height: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  footerButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  textActive: {
    color: '#3B82F6',
    fontWeight: '900',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 10, // Ajustado para que no choque con el borde inferior
    width: 20,
    height: 3,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
});
