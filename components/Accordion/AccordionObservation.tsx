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

if (
  Platform.OS === 'android' &&
  !(global as any).nativeFabricUIManager &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const AccordionObservation: FC<Props> = ({
  observation,
  showObservation,
  setObservation,
  setShowObservation,
  inspection,
  readOnly,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (readOnly || !observation) return;
    const delayDebounceFn = setTimeout(async () => {
      setIsSaving(true);
      try {
        await POST_Inspection({
          inspections: [
            {
              Id: inspection.id,
              AreaId: inspection.areaId,
              CreatedBy: inspection.createdBy,
              VehicleId: inspection.vehicleId,
              Comment: observation,
            },
          ],
        });
      } catch (error) {
        console.error('Error al autoguardar:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [observation, readOnly]);

  return (
    <>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setShowObservation(!showObservation);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name={readOnly ? 'note-text-outline' : 'note-edit-outline'}
            size={20}
            color={observation ? '#2196F3' : '#64748B'}
          />
          <Text
            style={[styles.accordionTitle, observation && { color: '#2196F3' }]}
          >
            Observaciones generales {readOnly && '(Lectura)'}
          </Text>
        </View>

        <View style={styles.headerRight}>
          {isSaving && <ActivityIndicator size={14} color='#2196F3' />}
          <MaterialCommunityIcons
            name={showObservation ? 'chevron-up' : 'chevron-down'}
            size={22}
            color='#64748B'
          />
        </View>
      </TouchableOpacity>

      {showObservation && (
        <View style={styles.observationContainer}>
          <TextInput
            placeholder={
              readOnly ? 'Sin observaciones' : 'Escribe notas permanentes...'
            }
            onChangeText={setObservation}
            value={observation}
            mode='outlined'
            multiline
            numberOfLines={3}
            editable={!readOnly}
            outlineColor={readOnly ? '#F1F5F9' : '#E2E8F0'}
            activeOutlineColor='#2196F3'
            style={[
              styles.observationInput,
              readOnly && { backgroundColor: '#F1F5F9', color: '#64748B' },
            ]}
          />

          {!readOnly && (
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
    paddingVertical: 7,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  accordionTitle: { fontSize: 15, fontWeight: '700', color: '#64748B' },
  observationContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  observationInput: { backgroundColor: '#F8FAFC', fontSize: 14, minHeight: 80 },
  autoSaveFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 4,
  },
  autoSaveText: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
});
