import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminScreen from '../../components/AdminScreen';
import AdminHeader from '../../components/AdminHeader';
import AdminButton from '../../components/AdminButton';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import SectionTitle from '../../components/SectionTitle';
import DetailRow from '../../components/DetailRow';
import InfoBox from '../../components/InfoBox';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

const tono = (estado) => {
  if (estado === 'Resuelto') return 'success';
  if (estado === 'Pendiente') return 'warning';
  return 'info';
};

export default function ReporteDetalleScreen({ id }) {
  const {
    reportePorId, usuarioPorId, servicioPorId, actualizarReporte, eliminarReporte,
  } = useData();
  const { navegar, volver } = useNav();
  const [confirmar, setConfirmar] = useState(false);

  const reporte = reportePorId(id);
  if (!reporte) {
    return (
      <AdminScreen active="Reportes">
        <AdminHeader title="Reporte" back />
        <EmptyState icon="alert-circle-outline" title="Reporte no encontrado" text="Puede que se haya eliminado." />
      </AdminScreen>
    );
  }

  const reporta = usuarioPorId(reporte.reportaId);
  const reportado = usuarioPorId(reporte.reportadoId);
  const servicio = reporte.servicioId ? servicioPorId(reporte.servicioId) : null;

  const cambiar = (estado) => {
    actualizarReporte(reporte.id, { estado });
    Alert.alert('Reporte actualizado', `El reporte quedó como «${estado}».`);
  };

  const borrar = () => {
    eliminarReporte(reporte.id);
    setConfirmar(false);
    Alert.alert('Reporte eliminado', 'El registro se quitó de la bandeja.');
    volver();
  };

  return (
    <AdminScreen active="Reportes">
      <AdminHeader kicker="Administrador · Reportes" title="Detalle del reporte" back />

      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.iconBig}>
            <Ionicons name="flag-outline" size={26} color="#FFFFFF" />
          </View>
          <Badge label={reporte.estado} tone={tono(reporte.estado)} />
        </View>
        <Text style={styles.tipo}>{reporte.tipo}</Text>
        <Text style={styles.fecha}>Reportado el {reporte.fecha}</Text>
      </View>

      <SectionTitle title="Motivo" />
      <View style={styles.motivoCard}>
        <Ionicons name="document-text-outline" size={18} color={colors.danger} />
        <Text style={styles.motivo}>{reporte.motivo}</Text>
      </View>

      <SectionTitle title="Personas involucradas" />
      <View style={styles.card}>
        <View style={styles.persona}>
          <Avatar initials={reporta ? reporta.iniciales : '??'} size={40} />
          <View style={{ flex: 1, marginLeft: spacing.sm + 4 }}>
            <Text style={styles.personaRol}>Quien reporta</Text>
            <Text style={styles.personaNombre}>{reporta ? reporta.nombre : '—'}</Text>
          </View>
          {reporta ? (
            <Pressable style={styles.verBtn} onPress={() => navegar('UsuarioDetalle', { id: reporta.id })}>
              <Text style={styles.verText}>Ver</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.separador} />
        <View style={styles.persona}>
          <Avatar initials={reportado ? reportado.iniciales : '??'} size={40} />
          <View style={{ flex: 1, marginLeft: spacing.sm + 4 }}>
            <Text style={styles.personaRol}>Persona reportada</Text>
            <Text style={styles.personaNombre}>{reportado ? reportado.nombre : '—'}</Text>
          </View>
          {reportado ? (
            <Pressable style={styles.verBtn} onPress={() => navegar('UsuarioDetalle', { id: reportado.id })}>
              <Text style={styles.verText}>Ver</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <SectionTitle title="Contexto" />
      <View style={styles.cardInfo}>
        <DetailRow label="Tipo de reporte" value={reporte.tipo} icon="flag-outline" tone="admin" />
        <DetailRow label="Servicio relacionado" value={servicio ? servicio.titulo : 'No aplica'} icon="pricetag-outline" tone="admin" />
        <DetailRow label="Estado actual" value={reporte.estado} icon="shield-outline" tone="admin" />
      </View>

      {servicio ? (
        <AdminButton
          label="Ver servicio reportado"
          variant="outline"
          icon="pricetag-outline"
          onPress={() => navegar('ServicioDetalle', { id: servicio.id })}
        />
      ) : null}

      <InfoBox
        tone={reporte.estado === 'Resuelto' ? 'success' : 'warning'}
        text={
          reporte.estado === 'Resuelto'
            ? 'Este reporte ya fue atendido. Puedes consultarlo como historial.'
            : 'Revisa la evidencia, conversa con las personas involucradas y documenta la decisión.'
        }
      />

      <AdminButton label="Marcar en revisión" variant="outline" icon="eye-outline" onPress={() => cambiar('En revisión')} />
      <AdminButton label="Marcar como resuelto" icon="checkmark-done-outline" onPress={() => cambiar('Resuelto')} />
      <AdminButton label="Eliminar reporte" variant="danger" icon="trash-outline" onPress={() => setConfirmar(true)} />

      <ConfirmDialog
        visible={confirmar}
        title="Eliminar reporte"
        message="El reporte se quitará de la bandeja. Esta acción no se puede deshacer."
        confirmLabel="Sí, eliminar"
        onConfirm={borrar}
        onCancel={() => setConfirmar(false)}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.danger, borderRadius: radius.lg, padding: spacing.lg },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBig: {
    width: 52, height: 52, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  tipo: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginTop: spacing.md },
  fecha: { fontSize: 11, color: '#FEE2E2', marginTop: 2 },
  motivoCard: {
    flexDirection: 'row', backgroundColor: colors.dangerSoft, borderRadius: radius.md,
    padding: spacing.md,
  },
  motivo: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 19, marginLeft: spacing.sm },
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, padding: spacing.md,
  },
  persona: { flexDirection: 'row', alignItems: 'center' },
  personaRol: { fontSize: 10, color: colors.textMuted },
  personaNombre: { fontSize: 14, fontWeight: '700', color: colors.text },
  separador: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm + 2 },
  verBtn: {
    borderWidth: 1, borderColor: colors.admin, borderRadius: radius.pill,
    paddingHorizontal: spacing.md, paddingVertical: 5,
  },
  verText: { fontSize: 11, fontWeight: '700', color: colors.admin },
  cardInfo: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
});
