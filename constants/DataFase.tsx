import { AntDesign, FontAwesome5 } from '@expo/vector-icons';

export const FASES = [
  {
    color: '#16A34A',
    name_fase: 'Chequeo',
    completed: 30,
    total: 61,
    iconName: <AntDesign name='check' size={24} color='#16A34A' />,
  },
  {
    color: '#004A99',
    name_fase: 'Ensamblaje',
    completed: 12,
    total: 61,
    iconName: <FontAwesome5 name='tools' size={24} color='#004A99' />,
  },
  {
    color: '#F39200',
    name_fase: 'PDI',
    completed: 50,
    total: 61,
    iconName: <FontAwesome5 name='car' size={24} color='#F39200' />,
  },
];
