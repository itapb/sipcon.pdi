import { DataFeatureOptions } from '@/utils/fetchs/features/GET_FeatureOptions';
import { Picker } from '@react-native-picker/picker';
import React, { FC } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  featureValueTypeId: number;
  value: number | null;
  readOnly: boolean;
  setvalue: React.Dispatch<React.SetStateAction<number | null>>;
  loadingOptions: boolean;
  options: DataFeatureOptions[];
};

export const InputByType: FC<Props> = (props) => {
  switch (+props.featureValueTypeId) {
    case 1: // SI / NO
      return (
        <View style={styles.qButtons}>
          <OptionButton
            label='Sí'
            type='success'
            isActive={props.value === 1}
            onPress={() => props.setvalue(1)}
            disabled={props.readOnly}
          />
          <View style={{ width: 10 }} />
          <OptionButton
            label='No'
            type='danger'
            isActive={props.value === 0}
            onPress={() => props.setvalue(0)}
            disabled={props.readOnly}
          />
        </View>
      );

    case 2: // LISTA DINÁMICA
      return (
        <View style={styles.inputContainer}>
          <Text style={styles.subLabel}>Seleccione una opción:</Text>
          <View
            style={[styles.listWrapper, props.readOnly && styles.readOnlyField]}
          >
            <Picker
              selectedValue={props.value}
              onValueChange={(itemValue) => props.setvalue(itemValue)}
              enabled={!props.readOnly && !props.loadingOptions}
              style={styles.picker}
              mode='dropdown'
              dropdownIconColor='#64748B'
            >
              <Picker.Item
                label={props.loadingOptions ? 'Cargando...' : 'Seleccione...'}
                value={null}
                color='#94A3B8'
              />
              {props.options.map((opt) => (
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
            value={props.value !== null ? String(props.value) : ''}
            onChangeText={(txt) => {
              // 1. Solo permitimos números
              const cleanText = txt.replace(/[^0-9]/g, '');

              if (cleanText === '') {
                props.setvalue(0); // En lugar de null, enviamos 0
                return;
              }

              const parsedValue = parseInt(cleanText, 10);
              const MAX = 999999; // Ajusta según Int32

              // 2. Validamos el máximo mientras escribe
              if (parsedValue <= MAX) {
                props.setvalue(parsedValue);
              }
            }}
            onBlur={() => {
              // 3. Validación final al salir del input (ejemplo: Minimo 10)
              const MIN = 0;
              if (props.value !== null && props.value < MIN) {
                props.setvalue(MIN);
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
  qButtons: { flexDirection: 'row', height: 44 },
  inputContainer: { marginVertical: 8 },
  subLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 6,
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
  readOnlyField: { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
  picker: {
    width: '100%',
    color: '#334155',
    ...Platform.select({ android: { marginLeft: -8 } }),
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
  errorText: { color: '#EF4444', fontSize: 12, fontStyle: 'italic' },
  optButton: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  textActiveGreen: { color: '#166534' },
  btnActiveRed: { backgroundColor: '#FEF2F2', borderColor: '#EF4444' },
  btnActiveGreen: { backgroundColor: '#F0FDF4', borderColor: '#22C55E' },
  btnInactive: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
  optButtonText: { fontSize: 14, fontWeight: '800' },
  textInactive: { color: '#94A3B8' },
  textActiveRed: { color: '#991B1B' },
});
