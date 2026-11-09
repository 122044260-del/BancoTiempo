import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

// Recuadro informativo. tone: 'info' (azul) | 'success' (verde) | 'warning' (amarillo)
const tones = {
  info: { bg: colors.primarySoft, fg: colors.primary, icon: 'information-circle-outline' },
  success: { bg: colors.successSoft, fg: colors.success, icon: 'checkmark-circle-outline' },
  warning: { bg: colors.warningSoft, fg: colors.warning, icon: 'alert-circle-outline' },
};

export default function InfoBox({ text, tone = 'info', title }) {
  const t = tones[tone];
  return (
    <View style={[styles.box, { backgroundColor: t.bg }]}>
      <Ionicons name={t.icon} size={20} color={t.fg} />
      <View style={{ flex: 1, marginLeft: spacing.sm }}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', padding: spacing.md, borderRadius: radius.md, marginTop: spacing.md },
  title: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 2 },
  text: { fontSize: 12, color: colors.text, lineHeight: 17 },
});