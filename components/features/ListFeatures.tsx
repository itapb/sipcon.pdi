import { type FC, useCallback, useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
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
};

export const ListFeatures: FC<Props> = ({
  Groups,
  readOnly,
  token,
  userId,
}) => {
  // 1. Formateamos los datos para SectionList: requiere un array de objetos con 'title' y 'data'
  const sections = useMemo(() => {
    return Groups.map((group) => ({
      title: group.featureType,
      data: group.questions,
    }));
  }, [Groups]);

  // 2. Usamos useCallback para que la función de renderizado no se recree en cada ciclo
  const renderItem = useCallback(
    ({ item }: { item: Questions }) => (
      <InspectionFeature
        feature={item.text}
        fileCount={0} // TODO: Pendiente por traer
        observation={item.observation}
        value={item.value}
        featureId={item.featureId}
        id={item.id}
        inspectionId={item.inspectionId}
        token={token}
        readOnly={readOnly}
        userId={userId}
      />
    ),
    [token, readOnly, userId],
  );

  // 3. Renderizado del encabezado de cada sección (featureType)
  const renderSectionHeader = useCallback(
    ({ section: { title } }: { section: { title: string } }) => (
      <View style={styles.headerContainer}>
        <Text style={styles.groupTitle}>{title}</Text>
      </View>
    ),
    [],
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => item.id.toString() + index}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      // OPTIMIZACIONES CLAVE:
      stickySectionHeadersEnabled={false} // Mantener en false mejora el rendimiento de scroll
      initialNumToRender={8} // Cuántos items cargar al principio
      maxToRenderPerBatch={10} // Cuántos items cargar por cada "lote" al hacer scroll
      windowSize={5} // Define cuánta área fuera de pantalla se mantiene renderizada
      removeClippedSubviews={true} // Desmonta componentes que están fuera de la vista
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={styles.scrollContent}
      style={styles.scrollContainer}
      // Espaciado final
      ListFooterComponent={<View style={{ height: 150 }} />}
    />
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
    backgroundColor: '#F8FAFC', // Mismo color de fondo para evitar saltos visuales
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
});
