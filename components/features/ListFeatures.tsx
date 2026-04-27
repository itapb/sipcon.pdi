import React, {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  SectionList,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { InspectionFeature } from './InspectionFeature';

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

export type Questions = {
  id: number;
  featureId: number;
  text: string;
  value: number | null;
  observation: string;
  fileUrl: string | null;
  inspectionId: number;
  featureValueTypeId: number;
  hasFiles: boolean;
};

export const ListFeatures: FC<Props> = ({
  Groups,
  readOnly,
  token,
  userId,
}) => {
  // Estado para el FeatureType visible
  const [currentFeatureType, setCurrentFeatureType] = useState<string>('');

  // Sincronizar el badge cuando cambian los grupos (evita desfase en UI)
  useEffect(() => {
    if (Groups && Groups.length > 0) {
      setCurrentFeatureType(Groups[0].featureType || 'Cargando...');
    } else {
      setCurrentFeatureType('');
    }
  }, [Groups]);

  // 1. Formateo seguro de secciones
  const sections = useMemo(() => {
    if (!Groups) return [];
    return Groups.map((group) => ({
      title: group.featureType || 'Sin Categoría',
      data: group.questions || [],
    }));
  }, [Groups]);

  // 2. Detección de sección visible con validación para evitar crashes al cambiar de datos
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems && viewableItems.length > 0) {
        const firstItem = viewableItems[0];
        // Validamos la existencia de la sección para evitar el error de "undefined"
        if (firstItem?.section?.title) {
          setCurrentFeatureType(firstItem.section.title);
        }
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

  // 3. RenderItem optimizado
  const renderItem = useCallback(
    ({ item }: { item: Questions }) => {
      if (!item) return null;

      return (
        <InspectionFeature
          feature={item.text || ''}
          fileCount={0}
          observation={item.observation || ''}
          value={item.value}
          featureId={item.featureId}
          id={item.id}
          inspectionId={item.inspectionId}
          token={token}
          readOnly={readOnly}
          userId={userId}
          featureValueTypeId={item.featureValueTypeId}
          hasFiles={item.hasFiles}
        />
      );
    },
    [token, readOnly, userId],
  );

  const renderSectionHeader = useCallback(
    ({ section: { title } }: { section: { title: string } }) => (
      <View style={styles.headerContainer}>
        <Text style={styles.groupTitle}>{title}</Text>
      </View>
    ),
    [],
  );

  return (
    <View style={{ flex: 1 }}>
      <SectionList
        sections={sections}
        // Key mejorada para evitar colisiones de ID entre fases
        keyExtractor={(item, index) => `${item.id}-${item.featureId}-${index}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        stickySectionHeadersEnabled={false}
        initialNumToRender={10} // Aumentado para mejor respuesta visual
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollContainer}
        // Espacio al final para que el último item no quede tapado por botones
        ListFooterComponent={<View style={{ height: 120 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingVertical: 10,
  },
  headerContainer: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 20,
    marginBottom: 4,
    marginTop: 10,
  },
  floatingBadge: {
    position: 'absolute',
    top: 0,
    width: '100%',
    left: 0,
    backgroundColor: '#94A3B8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  floatingBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});
