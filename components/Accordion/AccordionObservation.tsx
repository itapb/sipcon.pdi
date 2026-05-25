import { DataInspectionById } from '@/utils/fetchs/inspections/GET_InspectionById';
import { POST_Inspection } from '@/utils/fetchs/inspections/POST_Inspection';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { type FC, useEffect, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { ActivityIndicator, TextInput } from 'react-native-paper';

type Props = {
  observation: string;
  showObservation: boolean;
  setObservation: React.Dispatch<React.SetStateAction<string>>;
  setShowObservation: React.Dispatch<React.SetStateAction<boolean>>;
  inspection: DataInspectionById;
  readOnly: boolean;
};

const isNewArch = (global as any).nativeFabricUIManager != null;
if (
  Platform.OS === 'android' &&
  !isNewArch &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const AccordionObservation: FC<Props> = (props) => {
  const [isSaving, setIsSaving] = useState(false);

  const toggleObservation = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    props.setShowObservation(!props.showObservation);
  };

  const handleInternalSave = async () => {
    setIsSaving(true);
    try {
      const response = await POST_Inspection({
        inspections: [
          {
            Id: props.inspection.id,
            AreaId: props.inspection.areaId,
            CreatedBy: props.inspection.createdBy,
            VehicleId: props.inspection.vehicleId,
            Comment: props.observation,
          },
        ],
      });

      if (!response.ok) throw new Error('No se pudo procesar la petición');
    } catch (error) {
      console.error('Error al autoguardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // --- LÓGICA DE AUTOGUARDADO CONTROLADA ---
  useEffect(() => {
    // Si es readonly o no hay texto, no hacemos nada
    if (props.readOnly || !props.observation) return;

    const delayDebounceFn = setTimeout(async () => {
      await handleInternalSave();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [props.observation, props.readOnly]);

  return (
    <>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={toggleObservation}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name={props.readOnly ? 'note-text-outline' : 'note-edit-outline'}
            size={22}
            color={props.observation ? '#2196F3' : '#64748B'}
          />
          <Text
            style={[
              styles.accordionTitle,
              props.observation && styles.activeTitle,
            ]}
          >
            Observaciones generales {props.readOnly && '(Lectura)'}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {isSaving && <ActivityIndicator size={14} color='#2196F3' />}
          <MaterialCommunityIcons
            name={props.showObservation ? 'chevron-up' : 'chevron-down'}
            size={24}
            color='#64748B'
          />
        </View>
      </TouchableOpacity>

      {props.showObservation && (
        <View style={styles.observationContainer}>
          <TextInput
            placeholder={
              props.readOnly
                ? 'Sin observaciones'
                : 'Escribe notas permanentes...'
            }
            onChangeText={props.setObservation}
            value={props.observation}
            mode='outlined'
            multiline
            numberOfLines={3}
            editable={!props.readOnly} // Desactiva la edición
            outlineColor={props.readOnly ? '#F1F5F9' : '#E2E8F0'}
            activeOutlineColor='#2196F3'
            style={[
              styles.observationInput,
              props.readOnly && styles.readOnlyInput, // Estilo visual opcional para lectura
            ]}
          />

          {/* Solo mostramos el footer de guardado si NO es readonly */}
          {!props.readOnly && (
            <View style={styles.autoSaveFooter}>
              <MaterialCommunityIcons
                name={isSaving ? 'cloud-upload' : 'cloud-check'}
                size={14}
                color={isSaving ? '#2196F3' : '#10B981'}
              />
              <Text
                style={[
                  styles.autoSaveText,
                  { color: isSaving ? '#2196F3' : '#10B981' },
                ]}
              >
                {isSaving ? 'Sincronizando...' : 'Sincronizado'}
              </Text>
            </View>
          )}
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
  },
  readOnlyInput: {
    backgroundColor: '#F1F5F9',
    color: '#64748B',
  },
  autoSaveFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 4,
  },
  autoSaveText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
