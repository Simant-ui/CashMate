import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

export const SkeletonLoader = ({ type = 'card' }) => {
  const { colors } = useApp();

  if (type === 'balance') {
    return (
      <View style={[styles.skeleton, { backgroundColor: colors.bgSubtle, height: 140, width: '100%', borderRadius: 20 }]} />
    );
  }

  if (type === 'summaryGrid') {
    return (
      <View style={styles.grid}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={[styles.skeleton, { backgroundColor: colors.bgSubtle, height: 80, borderRadius: 14 }]} />
        ))}
      </View>
    );
  }

  if (type === 'list') {
    return (
      <View style={styles.list}>
        {[1, 2, 3].map(i => (
          <View key={i} style={[styles.skeleton, { backgroundColor: colors.bgSubtle, height: 64, borderRadius: 14 }]} />
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.skeleton, { backgroundColor: colors.bgSubtle, height: 100, width: '100%', borderRadius: 14 }]} />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    opacity: 0.6
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20
  },
  list: {
    gap: 10
  }
});
