import {
  getCachedOptions,
  setCachedOptions,
} from '@/hooks/featureOptionsCache';
import {
  DataFeatureOptions,
  GET_FeatureOptions,
} from '@/utils/fetchs/features/GET_FeatureOptions';
import { POST_InspectionDetail } from '@/utils/fetchs/inspections/POST_InspectionDetail';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useRef, useState, type FC } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MediaActions } from '../media/MediaActions';
import { InspectionSkeleton } from '../skeleton/skeletonFeature';

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
};

export const InspectionFeature: FC<Props> = (props) => {
  const [value, setvalue] = useState<number | null>(props.value);
  const [observation, setObservation] = useState(props.observation);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para la lista dinámica (Tipo 3)
  const [options, setOptions] = useState<DataFeatureOptions[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const observationRef = useRef(observation);
  const valueRef = useRef(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    observationRef.current = observation;
    valueRef.current = value;
  }, [observation, value]);

  useEffect(() => {
    if (+props.featureValueTypeId === 3) {
      const cached = getCachedOptions(props.featureId);
      if (cached) {
        setOptions(cached);
      } else {
        loadOptions();
      }
    }
  }, [props.featureId, props.featureValueTypeId]);

  const loadOptions = async () => {
    setLoadingOptions(true);
    try {
      const data = await GET_FeatureOptions({
        featureId: props.featureId,
        token: props.token,
      });
      if (data && Array.isArray(data)) {
        setOptions(data);
        setCachedOptions(props.featureId, data);
      }
    } catch (error) {
      console.error('Error cargando opciones para feature ' + props.featureId);
    } finally {
      setLoadingOptions(false);
    }
  };

  const OnSaveInfor = async (obsToSave = observation, valToSave = value) => {
    if (obsToSave === props.observation && valToSave === props.value) return;

    setIsSaving(true);
    try {
      await POST_InspectionDetail({
        id: props.id,
        value: valToSave,
        observation: obsToSave,
        featureId: props.featureId,
        inspectionId: props.inspectionId,
        token: props.token,
      });
    } catch (error: any) {
      Alert.alert('Error al guardar', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (props.readOnly) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      OnSaveInfor();
    }, 900);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [observation, value]);

  if (isSaving) return <InspectionSkeleton />;

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

      case 2: // NUMÉRICO (ENTERO ESTRICTO)
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
              value={value !== null ? String(value) : ''}
              onChangeText={(txt) => {
                const cleanText = txt.replace(/[^0-9]/g, '');
                setvalue(cleanText === '' ? null : parseInt(cleanText, 10));
              }}
              editable={!props.readOnly}
            />
          </View>
        );

      case 3: // LISTA DINÁMICA
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
                  <Picker.Item key={opt.id} label={opt.name} value={opt.id} />
                ))}
              </Picker>
            </View>
          </View>
        );

      default:
        return <Text style={styles.errorText}>Tipo de input no soportado</Text>;
    }
  };

  return (
    <Card style={styles.qCard}>
      <View style={styles.qHeader}>
        <Text style={styles.qText}>{props.feature}</Text>
        <View style={styles.qIcons}>
          <MediaActions
            userId={props.userId}
            token={props.token}
            fileCount={props.fileCount}
            recordID={props.id}
            moduleName='INSPECCION-TIPOS-CARACTERISTICAS'
          />
        </View>
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
};

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
    marginVertical: 6,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  qHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  qText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  qIcons: { flexDirection: 'row', alignItems: 'center' },
  qButtons: { flexDirection: 'row' },
  optButton: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  optButtonText: { fontSize: 14, fontWeight: '700' },
  btnInactive: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
  textInactive: { color: '#94A3B8' },
  btnActiveGreen: { backgroundColor: '#F0FDF4', borderColor: '#22C55E' },
  textActiveGreen: { color: '#166534' },
  btnActiveRed: { backgroundColor: '#FEF2F2', borderColor: '#EF4444' },
  textActiveRed: { color: '#991B1B' },
  inputContainer: { marginVertical: 5 },
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
    height: 42,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#334155',
  },
  listWrapper: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 48, // Ajustado para evitar cortes
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'android' ? 50 : 45,
    width: '100%',
    color: '#334155',
    ...Platform.select({
      android: { marginLeft: -8 },
    }),
  },
  obsInput: {
    marginTop: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
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
