import React, { type FC, useCallback, useMemo } from 'react';
import { Platform, SectionList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
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
  userId: number;
};

export const ListFeatures: FC<Props> = ({ Groups, readOnly, userId }) => {
  const sections = useMemo(() => {
    if (!Groups) return [];
    return Groups.map((group) => ({
      title: group.featureType || 'Sin Categoría',
      data: group.questions || [],
    }));
  }, [Groups]);

  const renderItem = useCallback(
    ({ item }: { item: Questions }) => (
      <InspectionFeature
        {...item}
        feature={item.text}
        readOnly={readOnly}
        userId={userId}
      />
    ),
    [readOnly, userId],
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) =>
          `${item.id}-${item.inspectionId}-${index}`
        }
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.headerContainer}>
            <Text style={styles.groupTitle}>{title}</Text>
          </View>
        )}
        keyboardShouldPersistTaps='handled'
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={true}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
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
});
