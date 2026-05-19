import { T_GroupInspectionsFase } from '@/utils/GroupInspectionsByFase';
import { DataAreas } from '@/utils/fetchs/Areas/Get_Areas';
import { AntDesign, Ionicons } from '@expo/vector-icons'; // 💡 Cambiamos a Ionicons para el check circular
import React, { FC } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CardFase } from '../card/CardFase';

type Props = {
  fases: T_GroupInspectionsFase[] | null;
  areas: DataAreas[] | null;
  faseId: number;
};

export const ContainerFases: FC<Props> = (props) => {
  if (!props.fases || props.fases.length === 0) {
    return (
      <View style={styles.completedContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name='checkmark-circle' size={32} color='#15803D' />
        </View>

        <View style={styles.textStack}>
          <Text style={styles.completedTitle}>¡Todo al día!</Text>
          <Text style={styles.completedSubtitle}>
            Ya tienes todo tu trabajo completo. No quedan fases pendientes en
            esta área.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ height: 110 }}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {props.fases.map(
          (item, index) =>
            props.areas?.some((areaItem) => areaItem.id === item.faseId) && (
              <CardFase
                key={index + item.name_fase}
                color={'green'}
                name_fase={item.name_fase}
                completed={item.completed}
                total={item.total}
                faseId={item.faseId}
                selectedFaseId={props.faseId}
                icon={<AntDesign name='check' size={24} color='#16A34A' />}
              />
            ),
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    gap: 15,
    alignItems: 'center',
  },
  completedContainer: {
    height: 110,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 20,
    gap: 15,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  textStack: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  completedTitle: {
    fontSize: 16,
    color: '#166534',
    fontWeight: '700',
  },
  completedSubtitle: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '500',
    lineHeight: 18,
  },
});
