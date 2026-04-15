import { POST_InspectionDetail } from '@/utils/fetchs/inspections/POST_InspectionDetail';
import { useEffect, useState, type FC } from 'react';
import {
  Alert,
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
  readOnly: boolean; // Propiedad para controlar el modo lectura
};

export const InspectionFeature: FC<Props> = (props) => {
  const [value, setvalue] = useState<number | null>(props.value);
  const [observation, setObservation] = useState(props.observation);
  const [isSaving, setIsSaving] = useState(false);

  const OnSaveInfor = async () => {
    if (observation === props.observation && value === props.value) return;

    setIsSaving(true);
    try {
      const result = await POST_InspectionDetail({
        id: props.id,
        value,
        observation,
        featureId: props.featureId,
        inspectionId: props.inspectionId,
        token: props.token,
      });

      if (result) {
        console.log(`Guardado exitoso: ${props.feature}`);
      }
    } catch (error: any) {
      Alert.alert('Error al guarda la inspección', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (props.readOnly) return;

    const timer = setTimeout(() => {
      OnSaveInfor();
    }, 900);

    return () => clearTimeout(timer);
  }, [observation, value]);

  if (isSaving) {
    return <InspectionSkeleton />;
  }

  return (
    <Card style={styles.qCard}>
      <View style={styles.qHeader}>
        <Text style={styles.qText}>{props.feature}</Text>
        <View style={styles.qIcons}>
          <MediaActions fileCount={props.fileCount} />
        </View>
      </View>

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

      <TextInput
        style={[
          styles.obsInput,
          props.readOnly && { backgroundColor: '#F1F5F9' },
        ]} // Cambio visual sutil en lectura
        placeholder='Observaciones...'
        placeholderTextColor='#94A3B8'
        multiline
        value={observation}
        onChangeText={setObservation}
        editable={!props.readOnly} // Bloquear entrada de texto
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
        disabled && { opacity: 0.7 }, // Feedback visual de deshabilitado
      ]}
      onPress={onPress}
      disabled={disabled} // Propiedad nativa para bloquear el toque
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    lineHeight: 18,
    marginRight: 10,
  },
  qIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qButtons: {
    flexDirection: 'row',
  },
  optButton: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  optButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  btnInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  textInactive: {
    color: '#94A3B8',
  },
  btnActiveGreen: {
    backgroundColor: '#F0FDF4',
    borderColor: '#22C55E',
  },
  textActiveGreen: {
    color: '#166534',
  },
  btnActiveRed: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  textActiveRed: {
    color: '#991B1B',
  },
  obsInput: {
    marginTop: 10,
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
  skeletonLine: {
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
  },
});
