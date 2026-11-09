import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import DetailRow from '../../components/DetailRow';
import RatingStars from '../../components/RatingStars';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

const tonoEstado = (estado) => {
  if (estado === 'Activo') return 'success';
  if (estado === 'Pausado') return 'warning';
  return 'info';
};

export default function ServicioDetalleScreen({ id }) {
  const {
    servicioPorId, categoriaDeServicio, usuarioPorId, usuarioActual, esFavorito,
    toggleFavorito, promedioUsuario, calificacionesDeUsuario, eliminarServicio,
  } = useData();
  const { navegar, volver } = useNav();
  const [confirmar, setConfirmar] = useState(false);

  const servicio = servicioPorId(id);
  if (!servicio) {
    return (
      <Screen>
        <Header title="Servicio" back />
        <EmptyState icon="alert-circle-outline" title="Servicio no encontrado" text="Puede que se haya eliminado." />
      </Screen>
    );
  }

  const categoria = categoriaDeServicio(servicio);
  const autor = usuarioPorId(servicio.usuarioId);
  const esMio = usuarioActual && usuarioActual.id === servicio.usuarioId;
  const esAdmin = usuarioActual && usuarioActual.rol === 'Administrador';
  const favorito = esFavorito(servicio.id);
  const promedio = autor ? promedioUsuario(autor.id) : 0;
  const resenas = autor ? calificacionesDeUsuario(autor.id) : [];

  const borrar = () => {
    eliminarServicio(servicio.id);
    setConfirmar(false);
    Alert.alert('Servicio eliminado', 'La publicación se quitó del catálogo.');
    volver();
  };

  const solicitar = () => {
    if (!usuarioActual) {
      Alert.alert('Inicia sesión', 'Necesitas una cuenta para solicitar un intercambio.');
      return;
    }
    if (esMio) {
      Alert.alert('Es tu servicio', 'No puedes solicitar tu propia publicación.');
      return;
    }
    navegar('SolicitudForm', { servicioId: servicio.id });
  };

  return (
    <Screen>
      <Header kicker={categoria ? `Catálogo · ${categoria.nombre}` : 'Catálogo'} title={servicio.titulo} back />

      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.iconBig}>
            <Ionicons name={categoria ? categoria.icono : 'pricetag-outline'} size={34} color="#FFFFFF" />
          </View>
          <Pressable style={styles.heart} onPress={() => toggleFavorito(servicio.id)}>
            <Ionicons
              name={favorito ? 'heart' : 'heart-outline'}
              size={22}
              color={favorito ? colors.danger : '#FFFFFF'}
            />
          </Pressable>
        </View>
        <Text style={styles.heroTitle}>{servicio.titulo}</Text>
        <Text style={styles.heroSub}>{categoria ? categoria.nombre : 'Sin categoría'}</Text>
        <View style={styles.heroBadges}>
          <Badge label={servicio.estado} tone={tonoEstado(servicio.estado)} />
          <View style={{ width: 6 }} />
          <Badge label={`${servicio.horas} h`} tone="info" />
          <View style={{ width: 6 }} />
          <Badge label={servicio.modalidad} tone="info" />
        </View>
      </View>

      {autor ? (
        <Pressable style={styles.author} onPress={() => navegar('UsuarioDetalle', { id: autor.id })}>
          <Avatar initials={autor.iniciales} size={46} />
          <View style={{ flex: 1, marginLeft: spacing.sm + 4 }}>
            <Text style={styles.authorName}>{autor.nombre}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <RatingStars value={promedio} size={13} />
              <Text style={styles.authorMeta}>
                {promedio ? `${promedio.toFixed(1)} · ${resenas.length} reseñas` : 'Sin reseñas'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}

      <Text style={styles.section}>Descripción</Text>
      <View style={styles.card}>
        <Text style={styles.desc}>{servicio.descripcion || 'Sin descripción.'}</Text>
      </View>

      <Text style={styles.section}>Detalles</Text>
      <View style={styles.card}>
        <DetailRow label="Habilidad" value={servicio.titulo ? categoriaDeServicio(servicio)?.nombre : '—'} icon="pricetag-outline" />
        <DetailRow label="Duración" value={`${servicio.horas} horas`} icon="timer-outline" />
        <DetailRow label="Modalidad" value={servicio.modalidad} icon="videocam-outline" />
        <DetailRow label="Publicado" value={servicio.fecha} icon="calendar-outline" />
        <DetailRow label="Costo en créditos" value={`${servicio.horas} créditos de tiempo`} icon="swap-horizontal-outline" />
      </View>

      {esMio || esAdmin ? (
        <>
          <Button label="Editar servicio" icon="create-outline" onPress={() => navegar('ServicioForm', { id: servicio.id })} />
          <Button label="Eliminar servicio" variant="danger" icon="trash-outline" onPress={() => setConfirmar(true)} />
        </>
      ) : (
        <Button label="Solicitar intercambio" icon="paper-plane-outline" onPress={solicitar} />
      )}

      {!esMio ? (
        <Button
          label={favorito ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          variant="outline"
          icon={favorito ? 'heart-dislike-outline' : 'heart-outline'}
          onPress={() => toggleFavorito(servicio.id)}
        />
      ) : null}

      <ConfirmDialog
        visible={confirmar}
        title="Eliminar servicio"
        message={`¿Deseas eliminar «${servicio.titulo}»? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        onConfirm={borrar}
        onCancel={() => setConfirmar(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconBig: {
    width: 64, height: 64, borderRadius: radius.lg, backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  heart: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { fontSize: 23, fontWeight: '800', color: '#FFFFFF', marginTop: spacing.md },
  heroSub: { fontSize: 12, color: '#C7D2FE', marginTop: 2 },
  heroBadges: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  author: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginTop: spacing.sm + 4,
  },
  authorName: { fontSize: 14, fontWeight: '700', color: colors.text },
  authorMeta: { fontSize: 11, color: colors.textMuted, marginLeft: spacing.xs + 2 },
  section: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  desc: { fontSize: 13, color: colors.text, lineHeight: 20, paddingVertical: spacing.sm },
});
