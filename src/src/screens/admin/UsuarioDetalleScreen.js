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
import RatingStars from '../../components/RatingStars';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function UsuarioDetalleScreen({ id }) {
  const {
    usuarioPorId, saldoUsuario, promedioUsuario, calificacionesDeUsuario,
    serviciosDeUsuario, solicitudesDeUsuario, actualizarUsuario, eliminarUsuario,
    servicioPorId,
  } = useData();
  const { navegar, volver } = useNav();
  const [confirmar, setConfirmar] = useState(false);

  const usuario = usuarioPorId(id);
  if (!usuario) {
    return (
      <AdminScreen active="Usuarios">
        <AdminHeader title="Usuario" back />
        <EmptyState icon="alert-circle-outline" title="Usuario no encontrado" text="Puede que la cuenta se haya eliminado." />
      </AdminScreen>
    );
  }

  const servicios = serviciosDeUsuario(usuario.id);
  const solicitudes = solicitudesDeUsuario(usuario.id);
  const resenas = calificacionesDeUsuario(usuario.id);
  const promedio = promedioUsuario(usuario.id);
  const activo = usuario.estado === 'Activo';

  const alternarEstado = () => {
    actualizarUsuario(usuario.id, { estado: activo ? 'Suspendido' : 'Activo' });
    Alert.alert(
      activo ? 'Cuenta suspendida' : 'Cuenta reactivada',
      activo
        ? `${usuario.nombre} ya no podrá iniciar sesión.`
        : `${usuario.nombre} puede volver a iniciar sesión.`
    );
  };

  const borrar = () => {
    eliminarUsuario(usuario.id);
    setConfirmar(false);
    Alert.alert('Usuario eliminado', 'La cuenta se quitó de la comunidad.');
    volver();
  };

  return (
    <AdminScreen active="Usuarios">
      <AdminHeader kicker="Administrador · Usuarios" title="Detalle del usuario" back />

      <View style={styles.hero}>
        <Avatar initials={usuario.iniciales} size={64} />
        <Text style={styles.nombre}>{usuario.nombre}</Text>
        <Text style={styles.correo}>{usuario.correo}</Text>
        <View style={styles.badges}>
          <Badge label={usuario.rol} tone="info" />
          <View style={{ width: 6 }} />
          <Badge label={usuario.estado} tone={activo ? 'success' : 'warning'} />
        </View>
        <View style={styles.rating}>
          <RatingStars value={promedio} size={15} />
          <Text style={styles.ratingText}>
            {promedio ? `${promedio.toFixed(1)} · ${resenas.length} reseñas` : 'Sin reseñas'}
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{saldoUsuario(usuario.id)}</Text>
          <Text style={styles.statLabel}>Créditos</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{servicios.length}</Text>
          <Text style={styles.statLabel}>Servicios</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{solicitudes.length}</Text>
          <Text style={styles.statLabel}>Solicitudes</Text>
        </View>
      </View>

      <SectionTitle title="Información de contacto" />
      <View style={styles.card}>
        <DetailRow label="Teléfono" value={usuario.telefono} icon="call-outline" tone="admin" />
        <DetailRow label="Ubicación" value={usuario.ubicacion} icon="location-outline" tone="admin" />
        <DetailRow label="Registro" value={usuario.fechaRegistro} icon="calendar-outline" tone="admin" />
        <DetailRow label="Biografía" value={usuario.bio} icon="document-text-outline" tone="admin" />
      </View>

      <SectionTitle title="Servicios publicados" action="Ver catálogo" onAction={() => navegar('Servicios')} />
      {servicios.length === 0 ? (
        <EmptyState icon="albums-outline" title="Sin servicios" text="Este usuario aún no publica servicios." />
      ) : (
        servicios.map((s) => (
          <Pressable key={s.id} style={styles.service} onPress={() => navegar('ServicioDetalle', { id: s.id })}>
            <Ionicons name="pricetag-outline" size={17} color={colors.admin} />
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.serviceTitle}>{s.titulo}</Text>
              <Text style={styles.serviceSub}>{s.horas} h · {s.modalidad} · {s.estado}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </Pressable>
        ))
      )}

      <AdminButton label="Editar usuario" icon="create-outline" onPress={() => navegar('UsuarioForm', { id: usuario.id })} />
      <AdminButton
        label="Ajustar créditos"
        variant="outline"
        icon="timer-outline"
        onPress={() => navegar('CreditoForm')}
      />
      <AdminButton
        label={activo ? 'Suspender cuenta' : 'Reactivar cuenta'}
        variant="outline"
        icon={activo ? 'pause-circle-outline' : 'play-circle-outline'}
        onPress={alternarEstado}
      />
      <AdminButton label="Eliminar usuario" variant="danger" icon="trash-outline" onPress={() => setConfirmar(true)} />

      <ConfirmDialog
        visible={confirmar}
        title="Eliminar usuario"
        message={`¿Deseas eliminar la cuenta de ${usuario.nombre}? Se perderá su acceso, pero sus servicios e historial permanecerán en el catálogo.`}
        confirmLabel="Sí, eliminar"
        onConfirm={borrar}
        onCancel={() => setConfirmar(false)}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, padding: spacing.lg,
  },
  nombre: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
  correo: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  badges: { flexDirection: 'row', marginTop: spacing.sm },
  rating: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  ratingText: { fontSize: 11, color: colors.textMuted, marginLeft: spacing.sm },
  stats: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.admin,
    borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.sm + 4,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 19, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 10, color: '#E0E7FF', marginTop: 1 },
  divider: { width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.25)' },
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  service: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.sm + 4, marginBottom: spacing.sm,
  },
  serviceTitle: { fontSize: 12, fontWeight: '700', color: colors.text },
  serviceSub: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
});
