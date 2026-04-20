import { ModalEndInspection } from '@/components/modal/ModalEndInspection';
import { ModalInspection } from '@/components/modal/ModalInspection';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useState, type FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  userId: number;
  areaId: number;
  token: string;
};

export const FooterMain: FC<Props> = (props) => {
  const insets = useSafeAreaInsets();
  const [openInpection, setOpenInpection] = useState(false);
  const [openEndInpection, setOpenEndInpection] = useState(false);

  // Acción para Nueva Inspección
  const handleNewInspection = () => {
    setOpenInpection(true);
  };

  // Acción para Salida
  const handleExit = () => {
    setOpenEndInpection(true);
  };

  return (
    <View
      style={[
        styles.fixedFooter,
        {
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
        },
      ]}
    >
      {/* Botón Izquierdo: NUEVA INSPECCIÓN */}
      <TouchableOpacity
        style={styles.footerButton}
        onPress={handleNewInspection}
        activeOpacity={0.7}
      >
        <View style={styles.greenCircle}>
          <MaterialIcons name='add' size={18} color='#22C55E' />
        </View>
        <Text style={[styles.footerButtonText, styles.textGreen]}>
          NUEVA INSPECCIÓN
        </Text>
      </TouchableOpacity>

      {/* Botón Derecho: SALIDA */}
      <TouchableOpacity
        style={styles.footerButton}
        onPress={handleExit}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name='car-side' size={26} color='#EF4444' />
        <Text style={[styles.footerButtonText, styles.textRed]}>SALIDA</Text>
      </TouchableOpacity>

      <ModalInspection
        onDismiss={setOpenInpection}
        visible={openInpection}
        areaId={props.areaId}
        token={props.token}
        userId={props.userId}
      />
      <ModalEndInspection
        onDismiss={setOpenEndInpection}
        visible={openEndInpection}
        areaId={props.areaId}
        token={props.token}
        userId={props.userId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    minHeight: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    paddingTop: 10,
  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  greenCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  footerButtonText: {
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  textGreen: {
    color: '#166534',
  },
  textRed: {
    color: '#EF4444',
  },
});
