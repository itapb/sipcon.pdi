import { StyleSheet, View } from 'react-native';

export const InspectionSkeleton = () => (
  <View style={styles.qCard}>
    <View
      style={[
        styles.skeletonLine,
        { width: '60%', height: 18, marginBottom: 15 },
      ]}
    />
    <View style={styles.qButtons}>
      <View style={[styles.skeletonLine, { flex: 1, height: 38 }]} />
      <View style={{ width: 10 }} />
      <View style={[styles.skeletonLine, { flex: 1, height: 38 }]} />
    </View>
    <View
      style={[
        styles.skeletonLine,
        { width: '100%', height: 45, marginTop: 12 },
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  qCard: {
    marginHorizontal: 15,
    marginVertical: 6,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  skeletonLine: {
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
  },
  qButtons: {
    flexDirection: 'row',
  },
});
