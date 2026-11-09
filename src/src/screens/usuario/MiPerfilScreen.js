import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserScreen from '../../components/UserScreen';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import RatingStars from '../../components/RatingStars';
import ServiceCard from '../../components/ServiceCard';
import SectionTitle from '../../components/SectionTitle';
import EmptyState from '../../components/EmptyState';
import MenuRow from '../../components/MenuRow';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function MiPerfilScreen() {
  const {
    usuarioActual, usuarioPorId, saldoUsuario, promedioUsuario,
    calificacionesDeUsuario, serviciosDeUsuario, favoritosDeUsuario, cerrarSesion,
  } = useData();
  const { navegar, reiniciar } = useNav();
  const usuario = usuarioActual || usuarioPorId('u1');

  if (!usuario) {
    return (
      <UserScreen active="Perfil">
        <Header title="Mi perfil" subtitle="Inicia sesión para ver tu información." />
        <EmptyState icon="person-outline" title="Sesión cerrada" text="Vuelve a entrar para consultar tu perfil." />
      </UserScreen>
    );
  }

  const calificaciones = calificacionesDeUsuario(usuario.id);
  const servicios = serviciosDeUsuario(usuario.id);
  const favoritos = favoritosDeUsuario(usuario.id);
  const promedio = promedioUsuario(usuario.id);

  const salir = () => {
    cerrarSesion();
    reiniciar('Bienvenida');
  };

  return (
    <UserScreen active="Perfil">
      <Header kicker="Mi cuenta" title="Mi perfil" subtitle="Así te ve la comunidad." />

      <View style={styles.hero}>
        <Avatar initials={usuario.iniciales} size={72} />
        <Text style={styles.name}>{usuario.nombre}</Text>
        <Text style={styles.role}>{usuario.rol}</Text>
        <View style={styles.badgeRow}>
          <Badge label={usuario.estado} tone={usuario.estado === 'Activo' ? 'success' : 'warning'} />
          <View style={{ width: 8 }} />
          <Badge label={usuario.ubicacion || 'Sin ubicación'} tone="info" />
        </View>
        <View style={styles.ratingRow}>
          <RatingStars value={promedio} size={16} />
          <Text style={styles.ratingText}>
            {promedio ? `${promedio.toFixed(1)} · ${calificaciones.length} reseñas` : 'Sin reseñas todavía'}
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{saldoUsuario(usuario.id)}</Text>
          <Text style={styles.statLabel}>Créditos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{servicios.length}</Text>
          <Text style={styles.statLabel}>Servicios</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{favoritos.length}</Text>
          <Text style={styles.statLabel}>Favoritos</Text>
        </View>
      </View>

      <View style={styles.bioCard}>
        <Text style={styles.bioLabel}>Sobre mí</Text>
        <Text style={styles.bioText}>{usuario.bio || 'Aún no has escrito una descripción.'}</Text>
        <View style={styles.contactRow}>
          <Ionicons name="mail-outline" size={14} color={colors.textMuted} />
          <Text style={styles.contactText}>{usuario.correo}</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="call-outline" size={14} color={colors.textMuted} />
          <Text style={styles.contactText}>{usuario.telefono || 'Sin teléfono'}</Text>
        </View>
      </View>

      <MenuRow
        icon="create-outline"
        title="Editar mi perfil"
        subtitle="Nombre, teléfono, ubicación y biografía"
        onPress={() => navegar('EditarPerfil')}
      />
      <MenuRow
        icon="albums-outline"
        title="Mis servicios"
        subtitle={`${servicios.length} publicados`}
        onPress={() => navegar('Servicios')}
      />
      <MenuRow
        icon="heart-outline"
        title="Mis favoritos"
        subtitle={`${favoritos.length} servicios guardados`}
        onPress={() => navegar('Favoritos')}
      />
      <MenuRow
        icon="star-outline"
        title="Mis calificaciones"
        subtitle={`${calificaciones.length} recibidas`}
        onPress={() => navegar('Calificaciones')}
      />
      <Pressable style={styles.logout} onPress={salir}>
        <Ionicons name="log-out-outline" size={19} color={colors.danger} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  name: { fontSize: 21, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
  role: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  badgeRow: { flexDirection: 'row', marginTop: spacing.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  ratingText: { fontSize: 11, color: colors.textMuted, marginLeft: spacing.sm },
  stats: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.sm + 4 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 10, color: '#C7D2FE', marginTop: 1 },
  statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.25)' },
  bioCard: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginTop: spacing.sm + 4, marginBottom: spacing.sm + 4 },
  bioLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase' },
  bioText: { fontSize: 13, color: colors.text, lineHeight: 19, marginTop: spacing.xs, marginBottom: spacing.sm },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  contactText: { fontSize: 12, color: colors.textMuted, marginLeft: 6 },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.md, paddingVertical: spacing.md },
  logoutText: { fontSize: 14, fontWeight: '700', color: colors.danger, marginLeft: 6 },
});
