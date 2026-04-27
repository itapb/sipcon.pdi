import { ModalConfirmInspection } from '@/components/modal/ModalConfirmInspection';
import { ModalEndInspection } from '@/components/modal/ModalEndInspection';
import { ModalInspection } from '@/components/modal/ModalInspection';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useState, type FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  userId: number;
  supplierId: number;
  areaId: number;
  token: string;
};

export const FooterMain: FC<Props> = (props) => {
  const insets = useSafeAreaInsets();
  const [openInpection, setOpenInpection] = useState(false);
  const [openEndInpection, setOpenEndInpection] = useState(false);
  const [openConfirmInspection, setOpenConfirmInspection] = useState(false);

  const handleNewInspection = () => setOpenInpection(true);

  // TODO! SE DEBE MEJORAR ESTO URGENTEMENTE
  const handleExit = () => {
    if (props.areaId === 13) {
      setOpenEndInpection(true); // Activamos este...
    } else {
      setOpenConfirmInspection(true); // ...o este
    }
  };

  return (
    <View
      style={[
        styles.fixedFooter,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
      ]}
    >
      {/* Botones */}
      <TouchableOpacity
        style={styles.footerButton}
        onPress={handleNewInspection}
      >
        <View style={styles.greenCircle}>
          <MaterialIcons name='add' size={18} color='#22C55E' />
        </View>
        <Text style={[styles.footerButtonText, styles.textGreen]}>
          NUEVA INSPECCIÓN
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerButton} onPress={handleExit}>
        <MaterialCommunityIcons name='car-side' size={26} color='#EF4444' />
        <Text style={[styles.footerButtonText, styles.textRed]}>
          {props.areaId === 13 ? 'SALIDA' : 'CIERRE'}
        </Text>
      </TouchableOpacity>

      {/* Modales - AQUÍ ESTABA EL ERROR DE MAPEO */}

      <ModalInspection
        onDismiss={setOpenInpection}
        visible={openInpection}
        areaId={props.areaId}
        token={props.token}
        userId={props.userId}
      />

      {/* Si es Area 13, mostramos el de Salida (End) */}
      <ModalEndInspection
        supplierId={props.supplierId}
        onDismiss={setOpenEndInpection} // Antes tenías setOpenConfirmInspection (MAL)
        visible={openEndInpection} // Antes tenías openConfirmInspection (MAL)
        areaId={props.areaId}
        token={props.token}
        userId={props.userId}
      />

      {/* Si NO es Area 13, mostramos el de Confirmación simple */}
      <ModalConfirmInspection
        onDismiss={setOpenConfirmInspection} // Antes tenías setOpenEndInpection (MAL)
        visible={openConfirmInspection} // Antes tenías openEndInpection (MAL)
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
