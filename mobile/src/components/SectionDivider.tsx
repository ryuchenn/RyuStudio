import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlobalTheme from '@/styles/Global';

interface SectionDividerProps {
  label?: string;
  dashed?: boolean;
  color?: string;
  marginVertical?: number;
  marginHorizontal?: number;
  withLine?: boolean;
}

const SectionDivider: React.FC<SectionDividerProps> = ({
  label,
  dashed = false,
  color = GlobalTheme.gray1,
  marginVertical = 10,
  marginHorizontal = 16,
  withLine = true,
}) => {
  return (
    <View
      style={[
        styles.container,
        { marginVertical, marginHorizontal },
      ]}
    >
      {withLine && <View style={[styles.line, dashed && styles.dashed, { borderBottomColor: color }]} />}
      {label && <Text style={styles.label}>{label}</Text>}
      {withLine && <View style={[styles.line, dashed && styles.dashed, { borderBottomColor: color }]} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    borderBottomWidth: 1,
  },
  dashed: {
    borderStyle: 'dashed',
  },
  label: {
    marginHorizontal: 8,
    fontSize: 14,
    color: GlobalTheme.gray3,
  },
});

export default SectionDivider;
