import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminScreen from '../../components/AdminScreen';
import AdminHeader from '../../components/AdminHeader';
import SegmentedTabs from '../../components/SegmentedTabs';
import Badge from '../../components/Badge';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

const tono = (estado) => {
  if (estado === 'Resuelto') return 'success';
  if (estado === 'Pendiente') return 'warning';
  return 'info';
};

const iconoTipo = (tipo) => {
  if (tipo === 'Spam') return 'mail-unread-outline';
  if (tipo === 'Usuario no asistió') return 'person-remove-outline';
  if (tipo === 'Mensaje ofensivo') return 'chatbox-ellipses-outline';
  return 'flag-outline';
};

export default function ReportesScreen() {
  const { reportes, usuarioPorId, servicioPorId } = useData();
  const { navegar } = useNav();
  const [vista, setVista] = useState('todos');

  const lista = useMemo(() => {
    if (vista === 'todos') return reportes;
    if (vista === 'pendientes') return reportes.filter((r) => r.estado === 'Pendiente');
    if (vista === 'revision') return reportes.filter((r) => r.estado === 'En revisión');
    return reportes.filter((r) => r.estado === 'Resuelto');
  }, [reportes, vista]);

  const pendientes = reportes.filter((r) => r.estado === 'Pendiente').length;
  const revision = reportes.filter((r) => r.estado === 'En revisión').length;
  const resueltos = reportes.filter((r) => r.estado === 'Resuelto').length;

  const porTipo = reportes.reduce((acc, r) => {
    acc[r.tipo] = (acc[r.tipo] || 0) + 1;
    return acc;
  }, {});
  const maxTipo = Math.max(...Object.values(porTipo), 1);

  return (
    <AdminScreen active="Reportes">
      <AdminHeader
        kicker="Administrador · Reportes"
        title="Reportes de la comunidad"
        subtitle="Da seguimiento a los problemas y mantén un espacio seguro."
      />

      <View style={styles.statsRow}>
        <StatCard icono="alert-circle-outline" valor={String(pendientes)} etiqueta="Pendientes" />
        <StatCard icono="eye-outline" valor={String(revision)} etiqueta="En revisión" />
      </View>
      <View style={styles.statsRow}>
        <StatCard icono="checkmark-done-outline" valor={String(resueltos)} etiqueta="Resueltos" />
        <StatCard icono="documents-outline" valor={String(reportes.length)} etiqueta="Reportes totales" />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Reportes por tipo</Text>
        {Object.entries(porTipo).map(([tipo, total]) => (
          <View key={tipo} style={styles.barRow}>
            <Text style={styles.barLabel} numberOfLines={1}>{tipo}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${(total / maxTipo) * 100}%` }]} />
            </View>
            <Text style={styles.barValue}>{total}</Text>
          </View>
        ))}
      </View>

      <SegmentedTabs
        tone="admin"
        options={[
          { label: 'Todos', value: 'todos' },
          { label: 'Pendientes', value: 'pendientes' },
          { label: 'Revisión', value: 'revision' },
          { label: 'Resueltos', value: 'resueltos' },
        ]}
        value={vista}
        onChange={setVista}
      />

      <Text style={styles.count}>{lista.length} reportes</Text>

      {lista.length === 0 ? (
        <EmptyState icon="shield-checkmark-outline" title="Todo en orden" text="No hay reportes en esta categoría." />
      ) : (
        lista.map((r) => {
          const reporta = usuarioPorId(r.reportaId);
          const reportado = usuarioPorId(r.reportadoId);
          const servicio = r.servicioId ? servicioPorId(r.servicioId) : null;
          return (
            <Pressable key={r.id} style={styles.card} onPress={() => navegar('ReporteDetalle', { id: r.id })}>
              <View style={styles.top}>
                <View style={styles.iconBox}>
                  <Ionicons name={iconoTipo(r.tipo)} size={19} color={colors.danger} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{r.tipo}</Text>
                  <Text style={styles.sub}>
                    {reporta ? reporta.nombre : 'Miembro'} reporta a {reportado ? reportado.nombre : 'un miembro'}
                  </Text>
                </View>
                <Badge label={r.estado} tone={tono(r.estado)} />
              </View>
              <Text style={styles.motivo} numberOfLines={2}>{r.motivo}</Text>
              <View style={styles.footer}>
                <Text style={styles.fecha}>{r.fecha}</Text>
                {servicio ? <Text style={styles.servicio}>{servicio.titulo}</Text> : null}
              </View>
            </Pressable>
          );
        })
      )}
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  chartCard: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, padding: spacing.md, marginTop: spacing.sm,
    marginBottom: spacing.sm + 4,
  },
  chartTitle: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  barLabel: { width: 130, fontSize: 10, color: colors.textMuted },
  barTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.background, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4, backgroundColor: colors.admin },
  barValue: { width: 22, textAlign: 'right', fontSize: 10, fontWeight: '700', color: colors.text },
  count: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm + 4,
  },
  top: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 38, height: 38, borderRadius: 10, backgroundColor: colors.dangerSoft,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm + 4,
  },
  title: { fontSize: 13, fontWeight: '700', color: colors.text },
  sub: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  motivo: { fontSize: 12, color: colors.textMuted, lineHeight: 18, marginTop: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  fecha: { fontSize: 10, color: colors.textMuted },
  servicio: { fontSize: 10, fontWeight: '600', color: colors.admin },
});
