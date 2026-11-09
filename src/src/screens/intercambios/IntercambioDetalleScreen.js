import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import DetailRow from '../../components/DetailRow';
import InfoBox from '../../components/InfoBox';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function IntercambioDetalleScreen({ id }) {
  const {
    intercambioPorId, servicioPorId, usuarioPorId, usuarioActual,
    confirmarIntercambio, completarIntercambio, eliminar,
  } = useData();
  const { navegar, volver } = useNav();
  const [confirmar, setConfirmar] = useState(false);

  const intercambio = intercambioPorId(id);
  if (!intercambio) {
    return (
      <Screen>
        <Header title="Intercambio" back />
        <EmptyState icon="alert-circle-outline" title="Intercambio no encontrado" text="Puede que se haya eliminado." />
      </Screen>
    );
  }

  const servicio = servicioPorId(intercambio.servicioId);
  const a = usuarioPorId(intercambio.usuarioA);
  const b = usuarioPorId(intercambio.usuarioB);
  const soyA = usuarioActual && usuarioActual.id === intercambio.usuarioA;
  const soyB = usuarioActual && usuarioActual.id === intercambio.usuarioB;
  const miConfirmacion = soyA ? intercambio.confirmadoA : soyB ? intercambio.confirmadoB : false;
  const ambas = intercambio.confirmadoA && intercambio.confirmadoB;
  const completado = intercambio.estado === 'Completado';
  const esAdmin = usuarioActual && usuarioActual.rol === 'Administrador';

  const confirmarYo = () => {
    confirmarIntercambio(intercambio.id);
    Alert.alert('Confirmación registrada', 'Cuando la otra persona confirme, podrán completar el intercambio.');
  };

  const completar = () => {
    completarIntercambio(intercambio.id);
    setConfirmar(false);
    Alert.alert(
      'Intercambio completado',
      `Se transfirieron ${intercambio.horas} créditos de ${a ? a.nombre : 'A'} a ${b ? b.nombre : 'B'}.`
    );
  };

  return (
    <Screen>
      <Header kicker="Intercambios · Sesiones" title="Detalle del intercambio" back />

      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <Badge label={intercambio.estado} tone={completado ? 'success' : 'info'} />
          <Text style={styles.fecha}>{intercambio.fecha}</Text>
        </View>
        <Text style={styles.heroTitle}>{servicio ? servicio.titulo : 'Intercambio de tiempo'}</Text>
        <Text style={styles.heroSub}>{intercambio.horas} horas · {intercambio.horas} créditos de tiempo</Text>
      </View>

      <Text style={styles.section}>Participantes</Text>
      <View style={styles.card}>
        <View style={styles.personas}>
          <View style={styles.persona}>
            <Avatar initials={a ? a.iniciales : '??'} size={44} />
            <Text style={styles.personaNombre}>{a ? a.nombre : '—'}</Text>
            <View style={styles.estadoFila}>
              <Ionicons
                name={intercambio.confirmadoA ? 'checkmark-circle' : 'ellipse-outline'}
                size={13}
                color={intercambio.confirmadoA ? colors.success : colors.textMuted}
              />
              <Text style={styles.estadoTexto}>{intercambio.confirmadoA ? 'Confirmó' : 'Sin confirmar'}</Text>
            </View>
          </View>
          <Ionicons name="swap-horizontal-outline" size={24} color={colors.admin} />
          <View style={styles.persona}>
            <Avatar initials={b ? b.iniciales : '??'} size={44} />
            <Text style={styles.personaNombre}>{b ? b.nombre : '—'}</Text>
            <View style={styles.estadoFila}>
              <Ionicons
                name={intercambio.confirmadoB ? 'checkmark-circle' : 'ellipse-outline'}
                size={13}
                color={intercambio.confirmadoB ? colors.success : colors.textMuted}
              />
              <Text style={styles.estadoTexto}>{intercambio.confirmadoB ? 'Confirmó' : 'Sin confirmar'}</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.section}>Datos del intercambio</Text>
      <View style={styles.detalles}>
        <DetailRow label="Servicio" value={servicio ? servicio.titulo : '—'} icon="pricetag-outline" />
        <DetailRow label="Quién recibe" value={a ? a.nombre : '—'} icon="person-outline" />
        <DetailRow label="Quién ofrece" value={b ? b.nombre : '—'} icon="person-outline" />
        <DetailRow label="Horas" value={`${intercambio.horas} h`} icon="timer-outline" />
      </View>

      {!completado ? (
        <InfoBox
          tone={ambas ? 'success' : 'info'}
          title={ambas ? 'Listos para completar' : 'Confirmación pendiente'}
          text={
            ambas
              ? 'Ambas personas confirmaron. Al completar se mueven los créditos automáticamente.'
              : 'Cada persona debe confirmar que la sesión se realizó para poder cerrar el intercambio.'
          }
        />
      ) : (
        <InfoBox tone="success" text="Este intercambio ya se completó y los créditos fueron transferidos." />
      )}

      {!completado && (soyA || soyB) && !miConfirmacion ? (
        <Button label="Confirmar que se realizó" icon="checkmark-done-outline" onPress={confirmarYo} />
      ) : null}

      {!completado && (ambas || esAdmin) ? (
        <Button label="Completar intercambio" icon="checkmark-circle-outline" onPress={() => setConfirmar(true)} />
      ) : null}

      {completado ? (
        <Button
          label="Calificar a mi contraparte"
          icon="star-outline"
          onPress={() => navegar('CalificacionForm', { intercambioId: intercambio.id })}
        />
      ) : null}

      {servicio ? (
        <Button
          label="Ver servicio"
          variant="outline"
          icon="pricetag-outline"
          onPress={() => navegar('ServicioDetalle', { id: servicio.id })}
        />
      ) : null}

      {esAdmin ? (
        <Button
          label="Eliminar intercambio (admin)"
          variant="danger"
          icon="trash-outline"
          onPress={() => {
            eliminar('intercambios', intercambio.id);
            Alert.alert('Intercambio eliminado', 'Se quitó el registro del historial.');
            volver();
          }}
        />
      ) : null}

      <ConfirmDialog
        visible={confirmar}
        title="Completar intercambio"
        message={`Se transferirán ${intercambio.horas} créditos de ${a ? a.nombre : 'una persona'} a ${b ? b.nombre : 'la otra'}. Esta acción actualiza los saldos.`}
        confirmLabel="Sí, completar"
        onConfirm={completar}
        onCancel={() => setConfirmar(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.admin, borderRadius: radius.lg, padding: spacing.lg,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fecha: { fontSize: 11, color: '#E0E7FF' },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginTop: spacing.md },
  heroSub: { fontSize: 12, color: '#E0E7FF', marginTop: 2 },
  section: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, padding: spacing.md,
  },
  personas: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  persona: { alignItems: 'center', flex: 1 },
  personaNombre: { fontSize: 12, fontWeight: '700', color: colors.text, marginTop: 4, textAlign: 'center' },
  estadoFila: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  estadoTexto: { fontSize: 9, color: colors.textMuted, marginLeft: 3 },
  detalles: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
});
