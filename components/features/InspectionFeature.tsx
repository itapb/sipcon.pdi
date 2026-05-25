import {
  getCachedOptions,
  setCachedOptions,
} from '@/hooks/featureOptionsCache';
import { useAutoSave } from '@/hooks/useAutoSave';
import {
  DataFeatureOptions,
  GET_FeatureOptions,
} from '@/utils/fetchs/features/GET_FeatureOptions';
import { POST_InspectionDetail } from '@/utils/fetchs/inspections/POST_InspectionDetail';
import React, { memo, useEffect, useState, type FC } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MediaActions } from '../media/MediaActions';
import { InputByType } from './InputByType';
import { SaveStatusLabel } from './SaveStatusLabel';

type Props = {
  id: number;
  feature: string;
  fileCount: number;
  observation: string;
  value: number | null;
  featureId: number;
  inspectionId: number;
  readOnly: boolean;
  userId: number;
  featureValueTypeId: number;
  hasFiles: boolean;
};

export const InspectionFeature: FC<Props> = memo((props) => {
  const { id, featureId, inspectionId } = props;
  const [options, setOptions] = useState<DataFeatureOptions[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Invocamos nuestro Hook de autoguardado pasándole la función fetch nativa
  const {
    value,
    observation,
    saveStatus,
    fadeAnim,
    isValidationInvalid,
    setvalue,
    setObservation,
    handleValueChange,
    handleObservationChange,
  } = useAutoSave({
    id,
    featureId,
    inspectionId,
    readOnly: props.readOnly,
    onSave: async (payload) => {
      await POST_InspectionDetail([payload] as any);
    },
  });

  // Inicializar los estados del hook con los valores originales de la DB
  useEffect(() => {
    setvalue(props.value);
    setObservation(props.observation);
  }, [props.value, props.observation]);

  // Carga de opciones dinámicas del selector
  useEffect(() => {
    if (+props.featureValueTypeId === 2) {
      const cached = getCachedOptions(featureId);
      if (cached) {
        setOptions(cached);
      } else {
        const loadOptions = async () => {
          if (loadingOptions) return;
          setLoadingOptions(true);
          try {
            const res = await GET_FeatureOptions({ featureId });
            if (res.ok && Array.isArray(res.data)) {
              setOptions(res.data);
              setCachedOptions(featureId, res.data);
            }
          } catch (e) {
            console.error(e);
          } finally {
            setLoadingOptions(false);
          }
        };
        loadOptions();
      }
    }
  }, [featureId, props.featureValueTypeId]);

  return (
    <Card style={[styles.qCard, isValidationInvalid && styles.invalidCard]}>
      <View style={styles.qHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.qText}>{props.feature}</Text>

          {isValidationInvalid && (
            <Text style={styles.errorLabel}>
              Justificación obligatoria si marca NO
            </Text>
          )}

          {!isValidationInvalid && (
            <SaveStatusLabel saveStatus={saveStatus} fadeAnim={fadeAnim} />
          )}
        </View>

        <MediaActions
          userId={props.userId}
          fileCount={props.fileCount}
          readOnly={props.readOnly}
          recordID={id}
          moduleName='INSPECCION-TIPOS-CARACTERISTICAS'
          hasFiles={props.hasFiles}
        />
      </View>

      <InputByType
        featureValueTypeId={props.featureValueTypeId}
        loadingOptions={loadingOptions}
        options={options}
        readOnly={props.readOnly}
        setvalue={handleValueChange}
        value={value}
      />

      <TextInput
        style={[
          styles.obsInput,
          props.readOnly && styles.readOnlyField,
          isValidationInvalid && styles.invalidInput,
        ]}
        placeholder='Escriba sus observaciones'
        placeholderTextColor={isValidationInvalid ? '#FCA5A5' : '#94A3B8'}
        multiline
        value={observation}
        onChangeText={handleObservationChange}
        editable={!props.readOnly}
        maxLength={500}
      />
    </Card>
  );
});

InspectionFeature.displayName = 'InspectionFeature';

const styles = StyleSheet.create({
  qCard: {
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  invalidCard: { borderColor: '#EF4444', backgroundColor: '#FFF5F5' },
  readOnlyField: { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
  qHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  qText: { flex: 1, fontSize: 14, color: '#1E293B', fontWeight: '700' },
  obsInput: {
    marginTop: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#334155',
    minHeight: 45,
    textAlignVertical: 'top',
    fontSize: 13,
  },
  invalidInput: { borderColor: '#FCA5A5', backgroundColor: '#FFF' },
  errorLabel: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 4,
    letterSpacing: 0.3,
  },
});
