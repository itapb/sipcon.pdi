import { useState, type FC } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MediaActions } from '../media/MediaActions';

type Props = {
  feature: string;
  fileCount: number;
};

export const InspectionFeature: FC<Props> = (props) => {
  const [status, setStatus] = useState<'Sí' | 'No' | null>(null);
  const [observation, setObservation] = useState('');

  return (
    <Card style={styles.qCard}>
      <View style={styles.qHeader}>
        {/* Pregunta */}
        <Text style={styles.qText}>{props.feature}</Text>

        {/* Iconos de acción */}
        <View style={styles.qIcons}>
          {/* Cámara más grande para facilitar el tap */}
          <MediaActions fileCount={props.fileCount} />
        </View>
      </View>

      {/* Selección de las respuestas */}
      <View style={styles.qButtons}>
        <OptionButton
          label='Sí'
          type='success'
          isActive={status === 'Sí'}
          onPress={() => setStatus('Sí')}
        />
        <View style={{ width: 10 }} />
        <OptionButton
          label='No'
          type='danger'
          isActive={status === 'No'}
          onPress={() => setStatus('No')}
        />
      </View>

      {/* Observaciones */}
      <TextInput
        style={styles.obsInput}
        placeholder='Observaciones...'
        placeholderTextColor='#94A3B8'
        multiline
        value={observation}
        onChangeText={setObservation}
      />
    </Card>
  );
};

const OptionButton = ({ label, isActive, type, onPress }: any) => {
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
      ]}
      onPress={onPress}
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
    alignItems: 'center', // Alineado al centro para que la cámara grande no desfase el texto
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
  folderWrapper: {
    position: 'relative',
    marginLeft: 15, // Aumentado un poco el espacio por el tamaño de la cámara
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -7,
    backgroundColor: '#2196F3',
    borderRadius: 8.5,
    width: 17,
    height: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
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
});
