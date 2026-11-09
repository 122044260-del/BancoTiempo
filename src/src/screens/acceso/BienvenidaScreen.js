import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import { colors, radius, spacing } from '../../theme';
import { useNav } from '../../navigation/context';

export default function BienvenidaScreen() {
  const { navegar } = useNav();

  return (
    <Screen>
      {/* Logo */}
      <View style={styles.logoRow}>
        <View style={styles.logoBox}>
          <Ionicons name="hand-left-outline" size={24} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.logoTitle}>Banco de Tiempo</Text>
          <Text style={styles.logoSub}>y Talento</Text>
        </View>
      </View>

      {/* Foto del servicio (marcador de posición) */}
      <View style={styles.photo}>
        <Ionicons name="people-outline" size={64} color="#FFFFFF" />
      </View>

      {/* Etiqueta */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Economía colaborativa</Text>
      </View>

      <Text style={styles.title}>Comparte lo que sabes. Recibe lo que necesitas.</Text>
      <Text style={styles.paragraph}>
        Ayuda con tu tiempo y recibe ayuda de personas de tu comunidad, sin dinero de por medio.
      </Text>

      {/* Tarjeta de regla */}
      <View style={styles.rule}>
        <Ionicons name="timer-outline" size={22} color={colors.success} />
        <Text style={styles.ruleText}>1 hora = 1 crédito de tiempo</Text>
      </View>

      <Button label="Comenzar" icon="arrow-forward" onPress={() => navegar('IniciarSesion')} />
      <Button
        label="Crear mi cuenta"
        variant="outline"
        onPress={() => navegar('Registro')}
      />

      <Text style={styles.footer}>Educación · Arte · Hogar · Mucho más</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  logoBox: {
    width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm + 4,
  },
  logoTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  logoSub: { fontSize: 12, color: colors.textMuted },
  photo: {
    height: 260, borderRadius: radius.lg, backgroundColor: '#8B7355',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start', backgroundColor: colors.successSoft, borderRadius: radius.pill,
    paddingHorizontal: 10, paddingVertical: 4, marginBottom: spacing.md,
  },
  badgeText: { fontSize: 11, fontWeight: '600', color: colors.success },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, lineHeight: 34, marginBottom: spacing.sm },
  paragraph: { fontSize: 14, color: colors.textMuted, lineHeight: 20, marginBottom: spacing.md },
  rule: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.successSoft,
    borderRadius: radius.md, padding: spacing.md,
  },
  ruleText: { marginLeft: spacing.sm + 4, fontSize: 14, fontWeight: '600', color: colors.text },
  footer: { textAlign: 'center', fontSize: 12, color: colors.textMuted, marginTop: spacing.md },
});
