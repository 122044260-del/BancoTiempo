import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

// Fila de detalle: etiqueta pequeña arriba y valor debajo.
export default function DetailRow({ label, value, icon, tone = 'primary' }) {
  const color = tone === 'admin' ? colors.admin : colors.primary;
  return (
    <View style={styles.row}>
      {icon ? <Ionicons name={icon} size={17} color={color} style={{ marginRight: spacing.sm }} /> : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || '—'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { fontSize: 11, color: colors.textMuted },
  value: { fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 1 },
});
