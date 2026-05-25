import React, { type FC } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  saveStatus: 'idle' | 'saving' | 'saved';
  fadeAnim: Animated.Value;
};

export const SaveStatusLabel: FC<Props> = ({ saveStatus, fadeAnim }) => {
  if (saveStatus === 'idle') return null;

  return (
    <Animated.View style={[styles.statusContainer, { opacity: fadeAnim }]}>
      <View
        style={[
          styles.statusDot,
          saveStatus === 'saved' ? styles.dotSaved : styles.dotSaving,
        ]}
      />
      <Text
        style={[
          styles.statusText,
          saveStatus === 'saved' ? styles.textSaved : styles.textSaving,
        ]}
      >
        {saveStatus === 'saving' ? 'Guardando cambios...' : 'Sincronizado'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dotSaving: { backgroundColor: '#2563EB' },
  dotSaved: { backgroundColor: '#16A34A' },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textSaving: { color: '#2563EB' },
  textSaved: { color: '#16A34A' },
});
