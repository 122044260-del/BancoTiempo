import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminScreen from '../../components/AdminScreen';
import AdminHeader from '../../components/AdminHeader';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import StatCard from '../../components/StatCard';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

const meses = ['Ago', 'Sep', 'Oct', 'Nov'];

export default function PanelGlobalScreen() {
  const {
    usuarioActual, usuarios, servicios, solicitudes, intercambios, reportes,
    movimientos, usuarioPorId, servicioPorId, saldoUsuario,
  } = useData();
  const { navegar } = useNav();

  const activos = usuarios.filter((u) => u.estado === 'Activo').length;
  const pendientes = solicitudes.filter((s) => s.estado === 'Pendiente').length;
  const completados = intercambios.filter((i) => i.estado === 'Completado').length;
  const reportesPendientes = reportes.filter((r) => r.estado !== 'Resuelto').length;
  const creditos = usuarios.reduce((t, u) => t + saldoUsuario(u.id), 0);
  const maxBarra = Math.max(
    ...meses.map((_, idx) => intercambios.filter((i) => Number(i.fecha.slice(5, 7)) === 8 + idx).length),
    1
  );

  const ultimas = [...solicitudes].sort((a, b) => (a.fecha < b.fecha ? 1 : -1)).slice(0, 4);

  return (
    <AdminScreen active="Panel">
      <AdminHeader
        kicker="Administrador · Panel global"
        title="Panel de la comunidad"
        subtitle="Resumen general del Banco de Tiempo y Talento."
      />

      <View style={styles.hero}>
        <Avatar initials={usuarioActual ? usuarioActual.iniciales : 'LH'} size={46} />
        <View style={{ flex: 1, marginLeft: spacing.sm + 4 }}>
          <Text style={styles.heroName}>{usuarioActual ? usuarioActual.nombre : 'Lucía Hernández'}</Text>
          <Text style={styles.heroRole}>Administradora de la comunidad</Text>
        </View>
        <Badge label="En línea" tone="success" />
      </View>

      <View style={styles.statsRow}>
        <StatCard icono="people-outline" valor={String(activos)} etiqueta="Miembros activos" />
        <StatCard icono="albums-outline" valor={String(servicios.length)} etiqueta="Servicios publicados" />
      </View>
      <View style={styles.statsRow}>
        <StatCard icono="mail-outline" valor={String(pendientes)} etiqueta="Solicitudes pendientes" />
        <StatCard icono="swap-horizontal-outline" valor={String(completados)} etiqueta="Intercambios cerrados" />
      </View>
      <View style={styles.statsRow}>
        <StatCard icono="timer-outline" valor={`${creditos}`} etiqueta="Créditos en circulación" />
        <StatCard icono="warning-outline" valor={String(reportesPendientes)} etiqueta="Reportes por atender" />
      </View>

      {/* Actividad mensual */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Intercambios por mes</Text>
        <Text style={styles.chartSub}>Movimiento de la comunidad en los últimos 4 meses</Text>
        <View style={styles.chart}>
          {meses.map((m, idx) => {
            const valor = intercambios.filter((i) => Number(i.fecha.slice(5, 7)) === 8 + idx).length;
            const alto = 10 + (valor / maxBarra) * 86;
            return (
              <View key={m} style={styles.barCol}>
                <Text style={styles.barValue}>{valor}</Text>
                <View style={[styles.bar, { height: alto }]} />
                <Text style={styles.barLabel}>{m}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Acciones rápidas */}
      <Text style={styles.section}>Acciones rápidas</Text>
      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={() => navegar('UsuarioForm')}>
          <Ionicons name="person-add-outline" size={20} color={colors.admin} />
          <Text style={styles.actionText}>Nuevo usuario</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={() => navegar('CategoriaForm')}>
          <Ionicons name="add-circle-outline" size={20} color={colors.admin} />
          <Text style={styles.actionText}>Nueva categoría</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={() => navegar('Reportes')}>
          <Ionicons name="bar-chart-outline" size={20} color={colors.admin} />
          <Text style={styles.actionText}>Ver reportes</Text>
        </Pressable>
      </View>

      {/* Actividad reciente */}
      <Text style={styles.section}>Actividad reciente</Text>
      {ultimas.map((s) => {
        const servicio = servicioPorId(s.servicioId);
        const persona = usuarioPorId(s.solicitanteId);
        return (
          <Pressable
            key={s.id}
            style={styles.activity}
            onPress={() => navegar('SolicitudDetalle', { id: s.id })}
          >
            <View style={styles.activityIcon}>
              <Ionicons name="mail-outline" size={17} color={colors.admin} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>
                {persona ? persona.nombre : 'Miembro'} solicitó {servicio ? servicio.titulo : 'un servicio'}
              </Text>
              <Text style={styles.activitySub}>{s.fecha}</Text>
            </View>
            <Badge
              label={s.estado}
              tone={s.estado === 'Pendiente' ? 'warning' : s.estado === 'Aceptada' ? 'success' : 'info'}
            />
          </Pressable>
        );
      })}

      {/* Reportes pendientes */}
      <View style={styles.reportHeader}>
        <Text style={styles.section}>Reportes por atender</Text>
        <Pressable onPress={() => navegar('Reportes')}>
          <Text style={styles.link}>Ver todos</Text>
        </Pressable>
      </View>
      {reportes.filter((r) => r.estado !== 'Resuelto').slice(0, 2).map((r) => (
        <Pressable key={r.id} style={styles.report} onPress={() => navegar('ReporteDetalle', { id: r.id })}>
          <Ionicons name="flag-outline" size={18} color={colors.danger} />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.reportTitle}>{r.tipo}</Text>
            <Text style={styles.reportSub} numberOfLines={1}>{r.motivo}</Text>
          </View>
          <Badge label={r.estado} tone={r.estado === 'Pendiente' ? 'warning' : 'info'} />
        </Pressable>
      ))}
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  heroName: { fontSize: 15, fontWeight: '800', color: colors.text },
  heroRole: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  chartCard: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, padding: spacing.md, marginTop: spacing.sm,
  },
  chartTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  chartSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 130, marginTop: spacing.md },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barValue: { fontSize: 10, fontWeight: '700', color: colors.admin, marginBottom: 3 },
  bar: { width: 24, borderRadius: 6, backgroundColor: colors.admin },
  barLabel: { fontSize: 10, color: colors.textMuted, marginTop: 4 },
  section: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  action: {
    flex: 1, alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, paddingVertical: spacing.md, marginHorizontal: 3,
  },
  actionText: { fontSize: 10, fontWeight: '700', color: colors.text, marginTop: 4, textAlign: 'center' },
  activity: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.sm + 4, marginBottom: spacing.sm,
  },
  activityIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: colors.adminSoft,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm + 4,
  },
  activityTitle: { fontSize: 12, fontWeight: '600', color: colors.text },
  activitySub: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  reportHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  link: { fontSize: 11, fontWeight: '700', color: colors.admin },
  report: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  reportTitle: { fontSize: 12, fontWeight: '700', color: colors.text },
  reportSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
});
