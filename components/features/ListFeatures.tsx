import React, { type FC, useCallback, useMemo, useRef, useState } from 'react';
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
};

export const ListFeatures: FC<Props> = ({
  Groups,
  readOnly,
  token,
  userId,
}) => {
  // Estado para el FeatureType visible
  const [currentFeatureType, setCurrentFeatureType] = useState<string>(
    Groups[0]?.featureType || 'Cargando...',
  );

  // 1. Formateo seguro de secciones
  const sections = useMemo(() => {
    if (!Groups) return [];
    return Groups.map((group) => ({
      title: group.featureType || 'Sin Categoría',
      data: group.questions || [],
    }));
  }, [Groups]);

  // 2. Detección de sección visible con validación
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems && viewableItems.length > 0) {
        const firstItem = viewableItems[0];
        // Verificamos que exista la sección y el título antes de asignar
        if (firstItem?.section?.title) {
          setCurrentFeatureType(firstItem.section.title);
        }
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // 3. RenderItem con validación de existencia del item
  const renderItem = useCallback(
    ({ item }: { item: Questions }) => {
      if (!item) return null; // Evita renderizar si el item es undefined

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
      {/* Indicador de Estación Actual */}
      <View style={styles.floatingBadge}>
        <Text style={styles.floatingBadgeText}>{currentFeatureType}</Text>
      </View>

      <SectionList
        sections={sections}
        // KEY EXTRACTOR SEGURO: Si id no existe, usa el index para evitar el crash
        keyExtractor={(item, index) => {
          if (item && item.id !== undefined) {
            return item.id.toString();
          }
          return `fallback-key-${index}`;
        }}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        stickySectionHeadersEnabled={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollContainer}
        ListFooterComponent={<View style={{ height: 150 }} />}
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
