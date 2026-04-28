import { POST_InspectionDetail } from '@/utils/fetchs/inspections/POST_InspectionDetail';
import React, { type FC, useCallback, useMemo, useState } from 'react';
import { Alert, Platform, SectionList, StyleSheet, View } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';
import { InspectionFeature } from './InspectionFeature';

export type Questions = {
  id: number;
  featureId: number;
  text: string;
  value: number | null;
  observation: string;
  inspectionId: number;
  featureValueTypeId: number;
  hasFiles: boolean;
  fileCount: number;
};

type Props = {
  Groups: {
    questions: Questions[];
    featureType: string;
    faseId: number;
  }[];
  readOnly: boolean;
  token: string;
  userId: number;
};

export const ListFeatures: FC<Props> = ({
  Groups,
  readOnly,
  token,
  userId,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<number, any>>({});

  const sections = useMemo(() => {
    if (!Groups) return [];
    return Groups.map((group) => ({
      title: group.featureType || 'Sin Categoría',
      data: group.questions || [],
    }));
  }, [Groups]);

  const handleDataChange = useCallback(
    (id: number, data: any, isOriginal: boolean) => {
      setPendingChanges((prev) => {
        const newChanges = { ...prev };
        if (isOriginal) {
          delete newChanges[id];
        } else {
          newChanges[id] = data;
        }
        return newChanges;
      });
    },
    [],
  );

  const onSaveAll = async () => {
    const changeArray = Object.values(pendingChanges);
    if (changeArray.length === 0) return;

    setIsSaving(true);

    try {
      // Pasamos el token y el array de cambios
      const response = await POST_InspectionDetail(changeArray as any, token);

      // Si la API responde correctamente
      if (response) {
        setPendingChanges({}); // Limpiamos cambios pendientes

        // ALERTA DE ÉXITO REFORZADA
        Alert.alert(
          '¡Guardado con éxito!',
          'La información se ha sincronizado correctamente en la nube.',
          [{ text: 'Entendido', style: 'default' }],
        );
      } else {
        throw new Error('No se recibió confirmación del servidor');
      }
    } catch (error: any) {
      console.error('Error en guardado masivo:', error);
      Alert.alert(
        'Error al sincronizar',
        error.message ||
          'No se pudo conectar con el servidor. Intente más tarde.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = Object.keys(pendingChanges).length > 0;

  const renderItem = useCallback(
    ({ item }: { item: Questions }) => (
      <InspectionFeature
        {...item}
        feature={item.text}
        token={token}
        readOnly={readOnly}
        userId={userId}
        isDirty={!!pendingChanges[item.id]}
        onDataChange={(data, isOriginal) =>
          handleDataChange(item.id, data, isOriginal)
        }
      />
    ),
    [token, readOnly, userId, pendingChanges, handleDataChange],
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <SectionList
        sections={sections}
        // Mantenemos una key segura
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.headerContainer}>
            <Text style={styles.groupTitle}>{title}</Text>
          </View>
        )}
        // VITAL: Para que el teclado no moleste al tocar botones
        keyboardShouldPersistTaps='handled'
        // RENDIMIENTO: Ideal para listas de inspección largas
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        // UX: Menos ruido visual
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        // ESPACIO: Para el botón flotante de la nube
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      {hasChanges && !readOnly && (
        <View style={styles.fabContainer}>
          {/* Contador pequeño sobre el botón */}
          <Surface style={styles.badge} elevation={4}>
            <Text style={styles.badgeText}>
              {Object.keys(pendingChanges).length}
            </Text>
          </Surface>

          <Button
            mode='contained'
            onPress={onSaveAll}
            loading={isSaving}
            disabled={isSaving}
            icon='cloud-upload'
            contentStyle={styles.fabContent}
            style={styles.fabCircle}
            labelStyle={styles.iconStyle}
            elevation={5}
          >
            {''}
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 60, // Un poco más arriba para que no choque con el borde
    right: 20, // Alineado a la derecha como botón flotante
    minWidth: 160,
  },
  btnSaveAll: {
    borderRadius: 30,
    backgroundColor: '#2563EB',
    height: 50,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  btnLabel: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    color: '#fff',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabContent: {
    width: 60,
    height: 60,
    marginLeft: 16, // Ajuste para centrar el icono cuando no hay texto
  },
  iconStyle: {
    fontSize: 28,
    color: '#FFF',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444', // Rojo para que resalte el pendiente
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
  },
});
