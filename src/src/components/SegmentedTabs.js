import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

// Selector segmentado (por ejemplo: Pendientes / Aceptadas).
export default function SegmentedTabs({ options, value, onChange, tone = 'primary' }) {
  const color = tone === 'admin' ? colors.admin : colors.primary;
  return (
    <View style={styles.box}>
      {options.map((opt) => {
        const item = typeof opt === 'string' ? { label: opt, value: opt } : opt;
        const activa = item.value === value;
        return (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
            style={[styles.item, activa && { backgroundColor: color }]}
          >
            <Text style={[styles.text, activa && styles.textActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    marginBottom: 12,
  },
  item: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: radius.sm },
  text: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  textActive: { color: '#FFFFFF' },
});
