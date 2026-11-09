import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserScreen from '../../components/UserScreen';
import Header from '../../components/Header';
import SegmentedTabs from '../../components/SegmentedTabs';
import Badge from '../../components/Badge';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

const tono = (estado) => {
  if (estado === 'Aceptada' || estado === 'Completada') return 'success';
  if (estado === 'Rechazada') return 'danger';
  if (estado === 'Pendiente') return 'warning';
  return 'info';
};

export default function SolicitudesScreen() {
  const {
    usuarioActual, solicitudes, solicitudesDeUsuario, servicioPorId, usuarioPorId,
  } = useData();
  const { navegar } = useNav();
  const [vista, setVista] = useState('recibidas');

  const base = usuarioActual ? solicitudesDeUsuario(usuarioActual.id) : solicitudes;

  const lista = useMemo(() => {
    if (!usuarioActual) return base;
    if (vista === 'recibidas') return base.filter((s) => s.proveedorId === usuarioActual.id);
    if (vista === 'enviadas') return base.filter((s) => s.solicitanteId === usuarioActual.id);
    return base;
  }, [base, vista, usuarioActual]);

  return (
    <UserScreen active="Solicitudes">
      <Header
        kicker="Intercambios · Solicitudes"
        title="Solicitudes"
        subtitle="Coordina quién te ayuda y a quién puedes ayudar."
      />

      <SegmentedTabs
        options={[
          { label: 'Recibidas', value: 'recibidas' },
          { label: 'Enviadas', value: 'enviadas' },
          { label: 'Todas', value: 'todas' },
        ]}
        value={vista}
        onChange={setVista}
      />

      <Button label="Nueva solicitud" icon="add-circle-outline" onPress={() => navegar('SolicitudForm')} />

      <Text style={styles.count}>
        {lista.length} {lista.length === 1 ? 'solicitud' : 'solicitudes'}
      </Text>

      {lista.length === 0 ? (
        <EmptyState
          icon="mail-open-outline"
          title="Sin solicitudes"
          text="Cuando alguien te pida un servicio o tú solicites uno, aparecerá aquí."
        />
      ) : (
        lista.map((s) => {
          const servicio = servicioPorId(s.servicioId);
          const solicitante = usuarioPorId(s.solicitanteId);
          const proveedor = usuarioPorId(s.proveedorId);
          const soyProveedor = usuarioActual && usuarioActual.id === s.proveedorId;
          const contraparte = soyProveedor ? solicitante : proveedor;
          return (
            <Pressable
              key={s.id}
              style={styles.card}
              onPress={() => navegar('SolicitudDetalle', { id: s.id })}
            >
              <View style={styles.top}>
                <Avatar initials={contraparte ? contraparte.iniciales : '??'} size={42} />
                <View style={{ flex: 1, marginLeft: spacing.sm + 4 }}>
                  <Text style={styles.title}>{servicio ? servicio.titulo : 'Servicio eliminado'}</Text>
                  <Text style={styles.sub}>
                    {soyProveedor ? 'De' : 'Para'} {contraparte ? contraparte.nombre : 'un miembro'} · {s.fecha}
                  </Text>
                </View>
                <Badge label={s.estado} tone={tono(s.estado)} />
              </View>
              <Text style={styles.msg} numberOfLines={2}>{s.mensaje}</Text>
              <View style={styles.footer}>
                <View style={styles.hours}>
                  <Ionicons name="timer-outline" size={13} color={colors.primary} />
                  <Text style={styles.hoursText}>{s.horas} h</Text>
                </View>
                <Text style={styles.link}>Ver detalle</Text>
              </View>
            </Pressable>
          );
        })
      )}
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  count: { fontSize: 12, color: colors.textMuted, marginTop: spacing.md, marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm + 4,
  },
  top: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 14, fontWeight: '700', color: colors.text },
  sub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  msg: { fontSize: 12, color: colors.textMuted, lineHeight: 18, marginTop: spacing.sm },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  hours: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3 },
  hoursText: { fontSize: 10, fontWeight: '700', color: colors.primary, marginLeft: 3 },
  link: { fontSize: 11, fontWeight: '700', color: colors.primary },
});
