import { FormLogin } from '@/components/forms/FormLogin';
import React from 'react';
import { Image, ScrollView, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/images/logos/LogoAPB.png')}
        style={styles.logoCustom}
      />
      <FormLogin />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginTop: 30,
  },
  logoCustom: {
    width: 200,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
});
