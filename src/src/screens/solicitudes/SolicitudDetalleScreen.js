import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import DetailRow from '../../components/DetailRow';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

const tono = (estado) => {
  if (estado === 'Aceptada' || estado === 'Completada') return 'success';
  if (estado === 'Rechazada') return 'danger';
  if (estado === 'Pendiente') return 'warning';
  return 'info';
};

export default function SolicitudDetalleScreen({ id }) {
  const {
    solicitudPorId, servicioPorId, usuarioPorId, usuarioActual, intercambios,
    aceptarSolicitud, rechazarSolicitud, eliminarSolicitud,
  } = useData();
  const { navegar, volver } = useNav();
  const [confirmar, setConfirmar] = useState(null);

  const solicitud = solicitudPorId(id);
  if (!solicitud) {
    return (
      <Screen>
        <Header title="Solicitud" back />
        <EmptyState icon="alert-circle-outline" title="Solicitud no encontrada" text="Puede que se haya eliminado." />
      </Screen>
    );
  }

  const servicio = servicioPorId(solicitud.servicioId);
  const solicitante = usuarioPorId(solicitud.solicitanteId);
  const proveedor = usuarioPorId(solicitud.proveedorId);
  const esSolicitante = usuarioActual && usuarioActual.id === solicitud.solicitanteId;
  const esProveedor = usuarioActual && usuarioActual.id === solicitud.proveedorId;
  const esAdmin = usuarioActual && usuarioActual.rol === 'Administrador';
  const intercambio = intercambios.find((i) => i.solicitudId === solicitud.id);

  const aceptar = () => {
    const creado = aceptarSolicitud(solicitud.id);
    if (creado) {
      Alert.alert('Solicitud aceptada', 'Se creó el intercambio. Coordina la sesión con la otra persona.');
      navegar('IntercambioDetalle', { id: creado.id });
    }
  };

  const rechazar = () => {
    rechazarSolicitud(solicitud.id);
    setConfirmar(null);
    Alert.alert('Solicitud rechazada', 'La otra persona podrá ver tu respuesta.');
  };

  const cancelar = () => {
    eliminarSolicitud(solicitud.id);
    setConfirmar(null);
    Alert.alert('Solicitud cancelada', 'La solicitud se eliminó.');
    volver();
  };

  return (
    <Screen>
      <Header kicker="Intercambios · Solicitudes" title="Detalle de solicitud" back />

      <View style={styles.card}>
        <View style={styles.rowTop}>
          <Text style={styles.servicio}>{servicio ? servicio.titulo : 'Servicio eliminado'}</Text>
          <Badge label={solicitud.estado} tone={tono(solicitud.estado)} />
        </View>
        <Text style={styles.fecha}>Enviada el {solicitud.fecha}</Text>

        <View style={styles.personas}>
          <View style={styles.persona}>
            <Avatar initials={solicitante ? solicitante.iniciales : '??'} size={40} />
            <Text style={styles.personaNombre}>{solicitante ? solicitante.nombre : '—'}</Text>
            <Text style={styles.personaRol}>Solicita</Text>
          </View>
          <Ionicons name="swap-horizontal-outline" size={22} color={colors.primary} />
          <View style={styles.persona}>
            <Avatar initials={proveedor ? proveedor.iniciales : '??'} size={40} />
            <Text style={styles.personaNombre}>{proveedor ? proveedor.nombre : '—'}</Text>
            <Text style={styles.personaRol}>Ofrece</Text>
          </View>
        </View>
      </View>

      <Text style={styles.section}>Mensaje</Text>
      <View style={styles.mensajeCard}>
        <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primary} />
        <Text style={styles.mensaje}>{solicitud.mensaje}</Text>
      </View>

      <Text style={styles.section}>Resumen</Text>
      <View style={styles.detalles}>
        <DetailRow label="Servicio" value={servicio ? servicio.titulo : '—'} icon="pricetag-outline" />
        <DetailRow label="Duración" value={`${solicitud.horas} horas`} icon="timer-outline" />
        <DetailRow label="Costo" value={`${solicitud.horas} créditos de tiempo`} icon="swap-horizontal-outline" />
        <DetailRow label="Modalidad" value={servicio ? servicio.modalidad : '—'} icon="videocam-outline" />
      </View>

      {solicitud.estado === 'Pendiente' && esProveedor ? (
        <>
          <Button label="Aceptar solicitud" icon="checkmark-circle-outline" onPress={aceptar} />
          <Button label="Rechazar solicitud" variant="danger" icon="close-circle-outline" onPress={() => setConfirmar('rechazar')} />
        </>
      ) : null}

      {solicitud.estado === 'Pendiente' && esSolicitante ? (
        <Button label="Cancelar mi solicitud" variant="outline" icon="trash-outline" onPress={() => setConfirmar('cancelar')} />
      ) : null}

      {intercambio ? (
        <Button
          label="Ver intercambio"
          icon="swap-horizontal-outline"
          onPress={() => navegar('IntercambioDetalle', { id: intercambio.id })}
        />
      ) : null}

      {solicitud.estado === 'Completada' ? (
        <Button label="Calificar este intercambio" icon="star-outline" onPress={() => navegar('CalificacionForm', { solicitudId: solicitud.id })} />
      ) : null}

      {esAdmin && solicitud.estado !== 'Pendiente' ? (
        <Button label="Eliminar solicitud (admin)" variant="danger" icon="trash-outline" onPress={() => setConfirmar('cancelar')} />
      ) : null}

      <ConfirmDialog
        visible={confirmar !== null}
        title={confirmar === 'rechazar' ? 'Rechazar solicitud' : 'Cancelar solicitud'}
        message={
          confirmar === 'rechazar'
            ? 'La persona que solicitó verá que no fue aceptada. ¿Continuar?'
            : 'La solicitud se eliminará de tu bandeja. ¿Continuar?'
        }
        confirmLabel={confirmar === 'rechazar' ? 'Sí, rechazar' : 'Sí, cancelar'}
        onConfirm={confirmar === 'rechazar' ? rechazar : cancelar}
        onCancel={() => setConfirmar(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, padding: spacing.md,
  },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  servicio: { flex: 1, fontSize: 18, fontWeight: '800', color: colors.text, marginRight: spacing.sm },
  fecha: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  personas: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: colors.background, borderRadius: radius.md, paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  persona: { alignItems: 'center', flex: 1 },
  personaNombre: { fontSize: 12, fontWeight: '700', color: colors.text, marginTop: 4, textAlign: 'center' },
  personaRol: { fontSize: 10, color: colors.textMuted },
  section: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  mensajeCard: {
    flexDirection: 'row', backgroundColor: colors.primarySoft, borderRadius: radius.md,
    padding: spacing.md,
  },
  mensaje: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 19, marginLeft: spacing.sm },
  detalles: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
});
