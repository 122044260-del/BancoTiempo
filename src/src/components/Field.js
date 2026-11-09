import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

// Campo de texto con etiqueta pequeña e ícono a la derecha.
// Si se pasa onChangeText funciona como campo controlado.
export default function Field({
  label,
  value,
  onChangeText,
  icon,
  secure = false,
  hint,
  keyboardType,
  multiline = false,
  placeholder,
  autoCapitalize = 'sentences',
}) {
  return (
    <View style={styles.box}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, multiline && styles.multiline]}
          value={onChangeText ? value : undefined}
          defaultValue={onChangeText ? undefined : value}
          onChangeText={onChangeText}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          multiline={multiline}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          autoCapitalize={autoCapitalize}
        />
        {icon ? <Ionicons name={icon} size={18} color={colors.textMuted} /> : null}
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.sm,
  },
  label: { fontSize: 11, color: colors.textMuted },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, fontSize: 15, color: colors.text, paddingVertical: 4 },
  multiline: { minHeight: 72, textAlignVertical: 'top' },
  hint: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
});
