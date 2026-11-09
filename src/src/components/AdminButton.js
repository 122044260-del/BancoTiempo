import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

// variant: 'primary' (índigo) | 'outline' (borde índigo) | 'danger' (rojo)
export default function AdminButton({
  label,
  variant = 'primary',
  icon,
  onPress,
  disabled = false,
}) {
  const outline = variant === 'outline';
  const danger = variant === 'danger';
  const textColor = outline ? (danger ? colors.danger : colors.admin) : '#FFFFFF';
  const fondo = danger ? styles.danger : outline ? styles.outline : styles.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, fondo, outline && danger && styles.outlineDanger, disabled && styles.disabled]}
    >
      {icon ? (
        <Ionicons name={icon} size={18} color={textColor} style={{ marginRight: 6 }} />
      ) : null}
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 46,
    borderRadius: radius.md,
    marginTop: spacing.sm + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  primary: { backgroundColor: colors.admin },
  outline: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.admin },
  outlineDanger: { borderColor: colors.danger },
  danger: { backgroundColor: colors.danger },
  disabled: { opacity: 0.45 },
  label: { fontSize: 14, fontWeight: '600' },
});
