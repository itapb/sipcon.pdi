import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { FC } from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { TextInput } from 'react-native-paper';

type Props = {
  observation: string;
  showObservation: boolean;
  setObservation: React.Dispatch<React.SetStateAction<string>>;
  setShowObservation: React.Dispatch<React.SetStateAction<boolean>>;
};

const isNewArch = (global as any).nativeFabricUIManager != null;

if (
  Platform.OS === 'android' &&
  !isNewArch && // Solo si no es la nueva arquitectura
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const AccordionObservation: FC<Props> = (props) => {
  const toggleObservation = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    props.setShowObservation(!props.showObservation);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={toggleObservation}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name='note-edit-outline'
            size={22}
            color={props.observation ? '#2196F3' : '#64748B'}
          />
          <Text
            style={[
              styles.accordionTitle,
              props.observation && styles.activeTitle,
            ]}
          >
            Observaciones generales
          </Text>
        </View>
        <MaterialCommunityIcons
          name={props.showObservation ? 'chevron-up' : 'chevron-down'}
          size={24}
          color='#64748B'
        />
      </TouchableOpacity>

      {/* Contenido que se oculta/muestra (Input Permanente) */}
      {props.showObservation && (
        <View style={styles.observationContainer}>
          <TextInput
            placeholder='Escribe notas permanentes sobre la unidad...'
            onChangeText={props.setObservation}
            value={props.observation}
            mode='outlined'
            multiline
            numberOfLines={3}
            outlineColor='#E2E8F0'
            activeOutlineColor='#2196F3'
            style={styles.observationInput}
            placeholderTextColor='#94A3B8'
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  activeTitle: {
    color: '#2196F3',
  },
  observationContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  observationInput: {
    backgroundColor: '#F8FAFC',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    padding: 3,
  },
});
