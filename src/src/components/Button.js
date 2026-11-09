import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

// variant: 'primary' (azul relleno) | 'outline' (borde azul) | 'danger' (rojo)
export default function Button({
  label,
  variant = 'primary',
  icon,
  onPress,
  disabled = false,
  loading = false,
}) {
  const outline = variant === 'outline';
  const danger = variant === 'danger';
  const textColor = outline ? (danger ? colors.danger : colors.primary) : '#FFFFFF';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.btn,
        outline ? styles.outline : danger ? styles.danger : styles.filled,
        outline && danger && styles.outlineDanger,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon ? (
            <Ionicons name={icon} size={18} color={textColor} style={{ marginRight: 6 }} />
          ) : null}
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 50,
    borderRadius: radius.md,
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  filled: { backgroundColor: colors.primary },
  outline: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.primary },
  outlineDanger: { borderColor: colors.danger },
  danger: { backgroundColor: colors.danger },
  disabled: { opacity: 0.45 },
  label: { fontSize: 15, fontWeight: '600' },
});
