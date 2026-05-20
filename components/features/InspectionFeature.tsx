import {
  getCachedOptions,
  setCachedOptions,
} from '@/hooks/featureOptionsCache';
import {
  DataFeatureOptions,
  GET_FeatureOptions,
} from '@/utils/fetchs/features/GET_FeatureOptions';
import React, { memo, useEffect, useRef, useState, type FC } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MediaActions } from '../media/MediaActions';
import { InputByType } from './InputByType';

type Props = {
  id: number;
  feature: string;
  fileCount: number;
  observation: string;
  value: number | null;
  featureId: number;
  inspectionId: number;
  token: string;
  readOnly: boolean;
  userId: number;
  featureValueTypeId: number;
  hasFiles: boolean;
  isDirty: boolean; // Recibido del padre
  onDataChange: (data: any, isOriginal: boolean) => void; // Notifica al padre
};

export const InspectionFeature: FC<Props> = memo((props) => {
  const [value, setvalue] = useState<number | null>(props.value);
  const [observation, setObservation] = useState(props.observation);
  const [options, setOptions] = useState<DataFeatureOptions[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const isMounted = useRef(true);

  // Detectamos si el estado actual es igual al original que vino por props
  const isOriginal = value === props.value && observation === props.observation;

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Notificar al padre cuando cambie algo
  useEffect(() => {
    props.onDataChange(
      {
        id: props.id,
        value: value,
        observation: observation,
        featureId: props.featureId,
        inspectionId: props.inspectionId,
      },
      isOriginal,
    );
  }, [value, observation, isOriginal]);

  useEffect(() => {
    if (+props.featureValueTypeId === 2) {
      const cached = getCachedOptions(props.featureId);
      if (cached) {
        setOptions(cached);
      } else {
        loadOptions();
      }
    }
  }, [props.featureId, props.featureValueTypeId]);

  const loadOptions = async () => {
    if (loadingOptions) return;
    setLoadingOptions(true);
    try {
      const data = await GET_FeatureOptions({
        featureId: props.featureId,
        token: props.token,
      });
      if (data && Array.isArray(data) && isMounted.current) {
        setOptions(data);
        setCachedOptions(props.featureId, data);
      }
    } catch (error) {
      console.error('Error cargando opciones para feature ' + props.featureId);
    } finally {
      if (isMounted.current) setLoadingOptions(false);
    }
  };

  return (
    <Card style={[styles.qCard, props.isDirty && styles.dirtyCard]}>
      <View style={styles.qHeader}>
        {/* Leyenda de cambios */}
        <View style={{ flex: 1 }}>
          <Text style={styles.qText}>{props.feature}</Text>
          {props.isDirty && (
            <Text style={styles.dirtyLabel}>Cambio pendiente</Text>
          )}
        </View>

        {/* Barra de acciones para los datos adjuntos */}
        <MediaActions
          userId={props.userId}
          token={props.token}
          fileCount={props.fileCount}
          readOnly={props.readOnly}
          recordID={props.id}
          moduleName='INSPECCION-TIPOS-CARACTERISTICAS'
          hasFiles={props.hasFiles}
        />
      </View>

      {/* Este componente permite seleccionar el tipo de input para la inspección */}
      <InputByType
        featureValueTypeId={props.featureValueTypeId}
        loadingOptions={loadingOptions}
        options={options}
        readOnly={props.readOnly}
        setvalue={setvalue}
        value={value}
      />

      {/* Input de observaciones */}
      <TextInput
        style={[styles.obsInput, props.readOnly && styles.readOnlyField]}
        placeholder='Observaciones...'
        placeholderTextColor='#94A3B8'
        multiline
        value={observation}
        onChangeText={setObservation}
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
  },
  readOnlyField: { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
  dirtyCard: {
    borderWidth: 1,
    borderLeftWidth: 2,
    borderColor: '#2563EB',
    backgroundColor: '#F0F7FF',
  },
  qHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  qText: { flex: 1, fontSize: 14, color: '#1E293B', fontWeight: '700' },
  dirtyLabel: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 2,
  },
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
});
