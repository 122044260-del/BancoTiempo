import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserScreen from '../../components/UserScreen';
import SectionTitle from '../../components/SectionTitle';
import ServiceCard from '../../components/ServiceCard';
import EmptyState from '../../components/EmptyState';
import RatingStars from '../../components/RatingStars';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

const accesos = [
  { icono: 'search-outline', texto: 'Explorar', ruta: 'Explorar' },
  { icono: 'mail-outline', texto: 'Solicitudes', ruta: 'Solicitudes' },
  { icono: 'timer-outline', texto: 'Créditos', ruta: 'Creditos' },
];

export default function InicioScreen() {
  const {
    usuarioActual, saldoUsuario, promedioUsuario, servicios, usuarioPorId,
    intercambiosDeUsuario, notificacionesDeUsuario, categoriaDeServicio, servicioPorId,
  } = useData();
  const { navegar } = useNav();
  const [saludo] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
  });

  const usuario = usuarioActual || usuarioPorId('u1');
  const saldo = usuario ? saldoUsuario(usuario.id) : 0;
  const promedio = usuario ? promedioUsuario(usuario.id) : 0;
  const activos = usuario ? intercambiosDeUsuario(usuario.id).filter((i) => i.estado !== 'Completado') : [];
  const noLeidas = usuario ? notificacionesDeUsuario(usuario.id).filter((n) => !n.leida).length : 0;
  const recomendados = servicios.filter((s) => s.estado === 'Activo').slice(0, 3);

  return (
    <UserScreen active="Inicio">
      {/* Saludo */}
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>{saludo}</Text>
          <Text style={styles.name}>{usuario ? usuario.nombre : 'Invitado'}</Text>
        </View>
        <Pressable style={styles.bell} onPress={() => navegar('Solicitudes')}>
          <Ionicons name="notifications-outline" size={21} color={colors.primary} />
          {noLeidas > 0 ? <View style={styles.dot} /> : null}
        </Pressable>
      </View>

      {/* Tarjeta de saldo */}
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroLabel}>Tu saldo de tiempo</Text>
            <Text style={styles.heroValue}>{saldo} h</Text>
          </View>
          <View style={styles.heroIcon}>
            <Ionicons name="time-outline" size={26} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.heroText}>1 hora de servicio = 1 crédito de tiempo.</Text>
        <View style={styles.heroActions}>
          <Pressable style={styles.heroBtn} onPress={() => navegar('CreditoForm')}>
            <Ionicons name="swap-horizontal-outline" size={15} color={colors.primary} />
            <Text style={styles.heroBtnText}>Transferir</Text>
          </Pressable>
          <Pressable style={styles.heroBtn} onPress={() => navegar('Creditos')}>
            <Ionicons name="list-outline" size={15} color={colors.primary} />
            <Text style={styles.heroBtnText}>Movimientos</Text>
          </Pressable>
        </View>
      </View>

      {/* Accesos rápidos */}
      <View style={styles.quickRow}>
        {accesos.map((a) => (
          <Pressable key={a.ruta} style={styles.quick} onPress={() => navegar(a.ruta)}>
            <View style={styles.quickIcon}>
              <Ionicons name={a.icono} size={20} color={colors.primary} />
            </View>
            <Text style={styles.quickText}>{a.texto}</Text>
          </Pressable>
        ))}
      </View>

      {/* Reputación */}
      <View style={styles.repCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.repLabel}>Tu reputación</Text>
          <Text style={styles.repValue}>{promedio ? `${promedio.toFixed(1)} de 5` : 'Sin calificaciones'}</Text>
        </View>
        <RatingStars value={promedio} size={18} />
      </View>

      {/* Intercambios activos */}
      <SectionTitle title="Tus intercambios activos" action="Ver todos" onAction={() => navegar('Intercambios')} />
      {activos.length === 0 ? (
        <EmptyState icon="swap-horizontal-outline" title="Todo al día" text="No tienes intercambios pendientes por ahora." />
      ) : (
        activos.map((i) => {
          const servicio = servicioPorId(i.servicioId);
          const otroId = i.usuarioA === usuario.id ? i.usuarioB : i.usuarioA;
          const otro = usuarioPorId(otroId);
          const categoria = servicio ? categoriaDeServicio(servicio) : null;
          return (
            <Pressable
              key={i.id}
              style={styles.exchange}
              onPress={() => navegar('IntercambioDetalle', { id: i.id })}
            >
              <View style={styles.exchangeIcon}>
                <Ionicons name={categoria ? categoria.icono : 'swap-horizontal-outline'} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.exchangeTitle}>{servicio ? servicio.titulo : 'Intercambio'}</Text>
                <Text style={styles.exchangeSub}>Con {otro ? otro.nombre : 'un miembro'} · {i.horas} h</Text>
              </View>
              <View style={styles.exchangeBadge}>
                <Text style={styles.exchangeBadgeText}>{i.estado}</Text>
              </View>
            </Pressable>
          );
        })
      )}

      {/* Recomendados */}
      <SectionTitle title="Recomendados para ti" action="Explorar" onAction={() => navegar('Explorar')} />
      {recomendados.map((s) => (
        <ServiceCard key={s.id} servicio={s} onPress={() => navegar('ServicioDetalle', { id: s.id })} />
      ))}

      <Text style={styles.footer}>Comparte lo que sabes · Recibe lo que necesitas</Text>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  kicker: { fontSize: 12, color: colors.textMuted },
  name: { fontSize: 24, fontWeight: '800', color: colors.text },
  bell: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  dot: {
    position: 'absolute', top: 9, right: 10, width: 8, height: 8,
    borderRadius: 4, backgroundColor: colors.danger,
  },
  hero: {
    backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg,
  },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  heroLabel: { fontSize: 12, color: '#C7D2FE' },
  heroValue: { fontSize: 40, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  heroIcon: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroText: { fontSize: 12, color: '#C7D2FE', marginTop: spacing.xs },
  heroActions: { flexDirection: 'row', marginTop: spacing.md },
  heroBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 8,
    marginRight: spacing.sm,
  },
  heroBtnText: { fontSize: 12, fontWeight: '700', color: colors.primary, marginLeft: 4 },
  quickRow: { flexDirection: 'row', marginTop: spacing.md, marginBottom: spacing.sm },
  quick: { flex: 1, alignItems: 'center' },
  quickIcon: {
    width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  quickText: { fontSize: 11, fontWeight: '600', color: colors.text },
  repCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginTop: spacing.sm,
  },
  repLabel: { fontSize: 11, color: colors.textMuted },
  repValue: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 2 },
  exchange: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.sm + 4, marginBottom: spacing.sm,
  },
  exchangeIcon: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm + 4,
  },
  exchangeTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  exchangeSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  exchangeBadge: {
    backgroundColor: colors.primarySoft, borderRadius: radius.pill,
    paddingHorizontal: 9, paddingVertical: 3,
  },
  exchangeBadgeText: { fontSize: 10, fontWeight: '700', color: colors.primary },
  footer: { textAlign: 'center', fontSize: 11, color: colors.textMuted, marginTop: spacing.lg },
});
