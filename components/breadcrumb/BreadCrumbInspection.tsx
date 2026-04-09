import { Link } from 'expo-router';
import { type FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const BreadCrumbInspection: FC = () => {
  return (
    <View style={styles.breadCrumbs}>
      <View style={styles.breadCrumbsTexts}>
        <Link href={'/'} asChild>
          <TouchableOpacity>
            <Text style={styles.text}>Inicio {'> '}</Text>
          </TouchableOpacity>
        </Link>
        <Text style={[styles.text, styles.text_fase]}>Fase</Text>
      </View>

      <TouchableOpacity style={[styles.button, styles.red]} activeOpacity={0.7}>
        <Text style={styles.buttonText}>Cerrar inspección</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  breadCrumbs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 45,
    backgroundColor: '#fff',
    borderColor: '#E2E8F0',
    borderBottomWidth: 1,
    zIndex: 10,
  },
  breadCrumbsTexts: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#64748B',
    fontSize: 15,
  },
  text_fase: {
    color: '#0C8CE9',
    fontWeight: '700',
  },
  button: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  red: {
    backgroundColor: '#FF383C',
  },
});
