import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import { useNav } from '../navigation/context';

// Encabezado con texto pequeño arriba, título grande y subtítulo.
// back=true muestra la flecha para regresar.
export default function Header({ kicker, title, subtitle, back = false, onBack }) {
  const { volver } = useNav();

  return (
    <View style={styles.box}>
      {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
      <View style={styles.row}>
        {back ? (
          <Pressable
            onPress={onBack || volver}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={10}
            style={styles.back}
          >
            <Ionicons name="chevron-back" size={26} color={colors.primary} />
          </Pressable>
        ) : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { marginBottom: spacing.md },
  kicker: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center' },
  back: { marginRight: spacing.xs },
  title: { fontSize: 26, fontWeight: '700', color: colors.primary },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: spacing.xs },
});
