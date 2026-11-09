import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserScreen from '../../components/UserScreen';
import Header from '../../components/Header';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function CreditosScreen() {
  const { usuarioActual, saldoUsuario, movimientosDeUsuario } = useData();
  const { navegar } = useNav();
  const movimientos = usuarioActual ? movimientosDeUsuario(usuarioActual.id) : [];
  const saldo = usuarioActual ? saldoUsuario(usuarioActual.id) : 0;
  const ganados = movimientos.filter((m) => m.monto > 0).reduce((t, m) => t + Number(m.monto), 0);
  const gastados = movimientos.filter((m) => m.monto < 0).reduce((t, m) => t + Math.abs(Number(m.monto)), 0);

  return (
    <UserScreen active="Créditos">
      <Header
        kicker="Mi cuenta · Créditos"
        title="Mis créditos"
        subtitle="El tiempo que das regresa como tiempo que recibes."
      />

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Saldo disponible</Text>
        <Text style={styles.heroValue}>{saldo} h</Text>
        <Text style={styles.heroText}>1 hora de servicio = 1 crédito de tiempo</Text>
        <View style={styles.heroRow}>
          <View style={styles.heroStat}>
            <Ionicons name="arrow-down-circle-outline" size={16} color="#BBF7D0" />
            <Text style={styles.heroStatText}>{ganados} ganados</Text>
          </View>
          <View style={styles.heroStat}>
            <Ionicons name="arrow-up-circle-outline" size={16} color="#FECACA" />
            <Text style={styles.heroStatText}>{gastados} usados</Text>
          </View>
        </View>
      </View>

      <Button label="Transferir créditos" icon="swap-horizontal-outline" onPress={() => navegar('CreditoForm')} />

      <View style={styles.infoRow}>
        <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
        <Text style={styles.infoText}>
          Los créditos se mueven automáticamente al completar un intercambio. También puedes transferirlos directamente.
        </Text>
      </View>

      <Text style={styles.section}>Movimientos</Text>
      {movimientos.length === 0 ? (
        <EmptyState icon="receipt-outline" title="Sin movimientos" text="Aquí verás cada ingreso y egreso de créditos." />
      ) : (
        movimientos.map((m) => {
          const positivo = Number(m.monto) > 0;
          return (
            <View key={m.id} style={styles.mov}>
              <View style={[styles.movIcon, { backgroundColor: positivo ? colors.successSoft : colors.dangerSoft }]}>
                <Ionicons
                  name={positivo ? 'add-outline' : 'remove-outline'}
                  size={18}
                  color={positivo ? colors.success : colors.danger}
                />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.sm + 4 }}>
                <Text style={styles.movConcepto}>{m.concepto}</Text>
                <Text style={styles.movFecha}>{m.fecha}</Text>
              </View>
              <Text style={[styles.movMonto, { color: positivo ? colors.success : colors.danger }]}>
                {positivo ? '+' : ''}{m.monto} h
              </Text>
            </View>
          );
        })
      )}

      <Pressable style={styles.historyLink} onPress={() => navegar('Intercambios')}>
        <Ionicons name="swap-horizontal-outline" size={17} color={colors.primary} />
        <Text style={styles.historyText}>Ver mis intercambios</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </Pressable>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg },
  heroLabel: { fontSize: 12, color: '#C7D2FE' },
  heroValue: { fontSize: 42, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  heroText: { fontSize: 11, color: '#C7D2FE', marginTop: 2 },
  heroRow: { flexDirection: 'row', marginTop: spacing.md },
  heroStat: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.pill, paddingHorizontal: spacing.sm + 2, paddingVertical: 5,
    marginRight: spacing.sm,
  },
  heroStatText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF', marginLeft: 4 },
  infoRow: { flexDirection: 'row', backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  infoText: { flex: 1, fontSize: 11, color: colors.text, lineHeight: 17, marginLeft: spacing.sm },
  section: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  mov: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.sm + 4, marginBottom: spacing.sm,
  },
  movIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  movConcepto: { fontSize: 12, fontWeight: '600', color: colors.text },
  movFecha: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  movMonto: { fontSize: 14, fontWeight: '800' },
  historyLink: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md,
  },
  historyText: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.text, marginLeft: spacing.sm },
});
