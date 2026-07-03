import React, {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Platform,
  SectionList,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
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
  onUpdateQuestionLocal: (
    idDetail: number,
    newValue: number | null,
    newObs: string,
  ) => void;
};

const SectionHeader = React.memo(({ title }: { title: string }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.groupTitle}>{title}</Text>
  </View>
));
SectionHeader.displayName = 'SectionHeader';

export const ListFeatures: FC<Props> = ({
  Groups,
  readOnly,
  userId,
  onUpdateQuestionLocal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const sections = useMemo(() => {
    if (!Groups) return [];

    const query = debouncedQuery.toLowerCase().trim();
    if (!query) {
      return Groups.map((group) => ({
        title: group.featureType || 'Sin Categoría',
        data: group.questions || [],
      }));
    }

    return Groups.map((group) => {
      const groupTitle = group.featureType || 'Sin Categoría';
      const matchesGroup = groupTitle.toLowerCase().includes(query);

      const filteredQuestions = (group.questions || []).filter((q) => {
        if (matchesGroup) return true;
        return q.text?.toLowerCase().includes(query);
      });

      return {
        title: groupTitle,
        data: filteredQuestions,
      };
    }).filter((section) => section.data.length > 0);
  }, [Groups, debouncedQuery]);

  const renderItem = useCallback(
    ({ item }: { item: Questions }) => (
      <InspectionFeature
        {...item}
        feature={item.text}
        readOnly={readOnly}
        userId={userId}
        onUpdateQuestionLocal={onUpdateQuestionLocal}
      />
    ),
    [readOnly, userId, onUpdateQuestionLocal],
  );

  const renderSectionHeader = useCallback(
    ({ section: { title } }: { section: { title: string } }) => (
      <SectionHeader title={title} />
    ),
    [],
  );

  // TRUCO DE RENDIMIENTO: Si las secciones están vacías, cambiamos la key del SectionList
  // para que se resetee el viewport nativo y no se congele al borrar el texto.
  const listKey = useMemo(() => {
    return sections.length === 0 ? 'list-empty' : 'list-with-data';
  }, [sections.length]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder='Buscar caracteristica...'
          placeholderTextColor='#94A3B8'
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize='none'
          autoCorrect={false}
          clearButtonMode='while-editing'
        />
      </View>

      <SectionList
        key={listKey} // Fuerza un reset del layout si pasa de "vacío" a "con datos"
        sections={sections}
        // Identificador único real estricto (crucial para remounts limpios en virtualización)
        keyExtractor={(item) => `feat-${item.id}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={true}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={{ paddingBottom: 140 }}
        // Configuración de velocidad máxima intacta
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        ListEmptyComponent={
          debouncedQuery !== '' ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No se encontraron resultados</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    height: 37,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '600',
  },
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
  },
});
