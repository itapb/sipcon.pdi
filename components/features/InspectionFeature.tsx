import {
  getCachedOptions,
  setCachedOptions,
} from '@/hooks/featureOptionsCache';
import {
  DataFeatureOptions,
  GET_FeatureOptions,
} from '@/utils/fetchs/features/GET_FeatureOptions';
import { Picker } from '@react-native-picker/picker';
import React, { memo, useEffect, useRef, useState, type FC } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MediaActions } from '../media/MediaActions';

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

  const renderInputByTypeId = () => {
    switch (+props.featureValueTypeId) {
      case 1: // SI / NO
        return (
          <View style={styles.qButtons}>
            <OptionButton
              label='Sí'
              type='success'
              isActive={value === 1}
              onPress={() => setvalue(1)}
              disabled={props.readOnly}
            />
            <View style={{ width: 10 }} />
            <OptionButton
              label='No'
              type='danger'
              isActive={value === 0}
              onPress={() => setvalue(0)}
              disabled={props.readOnly}
            />
          </View>
        );

      case 2: // LISTA DINÁMICA
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.subLabel}>Seleccione una opción:</Text>
            <View
              style={[
                styles.listWrapper,
                props.readOnly && styles.readOnlyField,
              ]}
            >
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => setvalue(itemValue)}
                enabled={!props.readOnly && !loadingOptions}
                style={styles.picker}
                mode='dropdown'
                dropdownIconColor='#64748B'
              >
                <Picker.Item
                  label={loadingOptions ? 'Cargando...' : 'Seleccione...'}
                  value={null}
                  color='#94A3B8'
                />
                {options.map((opt) => (
                  <Picker.Item key={opt.id} label={opt.name} value={+opt.id} />
                ))}
              </Picker>
            </View>
          </View>
        );

      case 3: // NUMÉRICO (ENTERO ESTRICTO)
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.subLabel}>Valor numérico:</Text>
            <TextInput
              style={[
                styles.numericInput,
                props.readOnly && styles.readOnlyField,
              ]}
              keyboardType='number-pad'
              placeholder='0'
              placeholderTextColor={'#94A3B8'}
              // Mostramos string vacío si es 0 para que sea fácil de borrar, o el valor
              value={value !== null ? String(value) : ''}
              onChangeText={(txt) => {
                // 1. Solo permitimos números
                const cleanText = txt.replace(/[^0-9]/g, '');

                if (cleanText === '') {
                  setvalue(0); // En lugar de null, enviamos 0
                  return;
                }

                const parsedValue = parseInt(cleanText, 10);
                const MAX = 999999; // Ajusta según Int32

                // 2. Validamos el máximo mientras escribe
                if (parsedValue <= MAX) {
                  setvalue(parsedValue);
                }
              }}
              onBlur={() => {
                // 3. Validación final al salir del input (ejemplo: Minimo 10)
                const MIN = 0;
                if (value !== null && value < MIN) {
                  setvalue(MIN);
                }
              }}
              editable={!props.readOnly}
            />
          </View>
        );

      default:
        return <Text style={styles.errorText}>Tipo no soportado</Text>;
    }
  };

  return (
    <Card style={[styles.qCard, props.isDirty && styles.dirtyCard]}>
      <View style={styles.qHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.qText}>{props.feature}</Text>
          {props.isDirty && (
            <Text style={styles.dirtyLabel}>Cambio pendiente</Text>
          )}
        </View>
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

      {renderInputByTypeId()}

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

const OptionButton = ({ label, isActive, type, onPress, disabled }: any) => {
  const isGreen = type === 'success' && isActive;
  const isRed = type === 'danger' && isActive;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.optButton,
        isGreen && styles.btnActiveGreen,
        isRed && styles.btnActiveRed,
        !isActive && styles.btnInactive,
        disabled && { opacity: 0.5 },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.optButtonText,
          isGreen && styles.textActiveGreen,
          isRed && styles.textActiveRed,
          !isActive && styles.textInactive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  qCard: {
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    elevation: 2,
  },
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
  qButtons: { flexDirection: 'row', height: 44 },
  optButton: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  optButtonText: { fontSize: 14, fontWeight: '800' },
  btnInactive: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
  textInactive: { color: '#94A3B8' },
  btnActiveGreen: { backgroundColor: '#F0FDF4', borderColor: '#22C55E' },
  textActiveGreen: { color: '#166534' },
  btnActiveRed: { backgroundColor: '#FEF2F2', borderColor: '#EF4444' },
  textActiveRed: { color: '#991B1B' },
  inputContainer: { marginVertical: 8 },
  subLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 6,
  },
  numericInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 46,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#334155',
  },
  listWrapper: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 50,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    color: '#334155',
    ...Platform.select({ android: { marginLeft: -8 } }),
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
  readOnlyField: { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
  errorText: { color: '#EF4444', fontSize: 12, fontStyle: 'italic' },
});
