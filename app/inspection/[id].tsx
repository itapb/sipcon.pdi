import { BreadCrumbInspection } from '@/components/breadcrumb/BreadCrumbInspection';
import { CardCar } from '@/components/card/CardCar';
import { ListFeatures } from '@/components/features/ListFeatures';
import { inspectionGroups } from '@/constants/DataInspectionDetail';
import { MenuHeader } from '@/layout/MenuHeader';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function InspectionScreen() {
  const { id } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(''); // Estado de búsqueda

  // Lógica de filtrado
  const filteredGroups = inspectionGroups
    .map((group) => {
      const questions = group.questions.filter((q) =>
        q.text.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      return questions.length > 0 ||
        group.title.toLowerCase().includes(searchQuery.toLowerCase())
        ? { ...group, questions }
        : null;
    })
    .filter((g) => g !== null);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <MenuHeader />

        {/* BreadCrumbs fijos */}
        <BreadCrumbInspection />

        {/* Información rápida de la unidad */}
        <CardCar
          model_name='Changan CS15'
          vin={1234567890}
          plate='ABC-123'
          imageSource={require('../../assets/images/carros/FotoAuto.png')}
        />

        {/* Buscador para la inspección */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder='Buscar pregunta...'
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
          />
        </View>

        {/* Lista de features */}
        <ListFeatures Groups={filteredGroups} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchBar: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 45,
  },
  searchInput: {
    fontSize: 14,
    minHeight: 0,
  },
});
