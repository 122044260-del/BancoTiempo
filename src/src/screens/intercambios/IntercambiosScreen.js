import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserScreen from '../../components/UserScreen';
import Header from '../../components/Header';
import SegmentedTabs from '../../components/SegmentedTabs';
import Badge from '../../components/Badge';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

const tono = (estado) => {
  if (estado === 'Completado') return 'success';
  if (estado === 'En curso') return 'info';
  if (estado === 'Pendiente') return 'warning';
  return 'info';
};

export default function IntercambiosScreen() {
  const {
    usuarioActual, usuarioPorId, intercambiosDeUsuario, servicioPorId,
  } = useData();
  const { navegar } = useNav();
  const [vista, setVista] = useState('activos');

  const todos = usuarioActual ? intercambiosDeUsuario(usuarioActual.id) : [];
  const lista = todos.filter((i) =>
    vista === 'activos' ? i.estado !== 'Completado' : i.estado === 'Completado'
  );

  return (
    <UserScreen active="Solicitudes">
      <Header
        kicker="Intercambios · Sesiones"
        title="Intercambios"
        subtitle="Sigue el avance de tus sesiones de tiempo."
        back
      />

      <SegmentedTabs
        options={[
          { label: 'Activos', value: 'activos' },
          { label: 'Completados', value: 'completados' },
        ]}
        value={vista}
        onChange={setVista}
      />

      {lista.length === 0 ? (
        <EmptyState
          icon="swap-horizontal-outline"
          title={vista === 'activos' ? 'Sin intercambios activos' : 'Aún no hay historial'}
          text={
            vista === 'activos'
              ? 'Acepta una solicitud para comenzar un intercambio.'
              : 'Cuando completes un intercambio aparecerá aquí.'
          }
        />
      ) : (
        lista.map((i) => {
          const servicio = servicioPorId(i.servicioId);
          const otroId = usuarioActual && i.usuarioA === usuarioActual.id ? i.usuarioB : i.usuarioA;
          const otro = usuarioPorId(otroId);
          const confirmado = usuarioActual
            ? i.usuarioA === usuarioActual.id
              ? i.confirmadoA
              : i.confirmadoB
            : false;
          return (
            <Pressable
              key={i.id}
              style={styles.card}
              onPress={() => navegar('IntercambioDetalle', { id: i.id })}
            >
              <View style={styles.top}>
                <Avatar initials={otro ? otro.iniciales : '??'} size={42} />
                <View style={{ flex: 1, marginLeft: spacing.sm + 4 }}>
                  <Text style={styles.title}>{servicio ? servicio.titulo : 'Intercambio'}</Text>
                  <Text style={styles.sub}>Con {otro ? otro.nombre : 'un miembro'} · {i.fecha}</Text>
                </View>
                <Badge label={i.estado} tone={tono(i.estado)} />
              </View>
              <View style={styles.footer}>
                <View style={styles.pill}>
                  <Ionicons name="timer-outline" size={13} color={colors.primary} />
                  <Text style={styles.pillText}>{i.horas} h · {i.horas} créditos</Text>
                </View>
                <View style={[styles.confirm, confirmado && styles.confirmOk]}>
                  <Ionicons
                    name={confirmado ? 'checkmark-circle' : 'ellipse-outline'}
                    size={14}
                    color={confirmado ? colors.success : colors.textMuted}
                  />
                  <Text style={[styles.confirmText, confirmado && { color: colors.success }]}>
                    {confirmado ? 'Tú confirmaste' : 'Falta tu confirmación'}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })
      )}
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm + 4,
  },
  top: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 14, fontWeight: '700', color: colors.text },
  sub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  pill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3 },
  pillText: { fontSize: 10, fontWeight: '700', color: colors.primary, marginLeft: 3 },
  confirm: { flexDirection: 'row', alignItems: 'center' },
  confirmOk: {},
  confirmText: { fontSize: 10, color: colors.textMuted, marginLeft: 4 },
});
