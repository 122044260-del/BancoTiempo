import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

// Tarjeta de estadística: ícono, número grande y etiqueta. Ocupa la mitad del ancho.
export default function StatCard({ icono, valor, etiqueta }) {
  return (
    <View style={styles.card}>
      <Ionicons name={icono} size={20} color={colors.admin} />
      <Text style={styles.valor}>{valor}</Text>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%', backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm + 4,
  },
  valor: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: spacing.xs },
  etiqueta: { fontSize: 12, color: colors.textMuted },
});

