import { type FC } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { InspectionFeature } from './InspectionFeature';

type Props = {
  Groups: {
    questions: {
      id: number;
      text: string;
      files: number;
    }[];
    title: string;
  }[];
};

export const ListFeatures: FC<Props> = (props) => {
  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps='handled'
    >
      {/* Mapeo de grupos filtrados */}
      {props.Groups.map((group, index) => (
        <View key={index} style={styles.groupContainer}>
          <Text style={styles.groupTitle}>{group?.title}</Text>
          {group?.questions.map((q) => (
            <InspectionFeature
              key={q.id}
              feature={q.text}
              fileCount={q.files}
            />
          ))}
        </View>
      ))}

      <View style={{ height: 200 }} />
    </ScrollView>
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
  groupContainer: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 13, // Un poquito más pequeño para seguir tu nueva línea minimalista
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 20,
    marginBottom: 8,
    marginTop: 10,
  },
});
