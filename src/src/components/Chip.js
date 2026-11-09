import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

// Chip seleccionable para filtros y categorías.
export default function Chip({ label, active = false, onPress, tone = 'primary', style }) {
  const color = tone === 'admin' ? colors.admin : colors.primary;
  const soft = tone === 'admin' ? colors.adminSoft : colors.primarySoft;
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: active ? color : colors.card, borderColor: active ? color : colors.border },
        style,
      ]}
    >
      <Text style={[styles.text, { color: active ? '#FFFFFF' : colors.textMuted }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  text: { fontSize: 12, fontWeight: '600' },
});
