import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Header from '../../components/Header';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import RatingStars from '../../components/RatingStars';
import InfoBox from '../../components/InfoBox';
import EmptyState from '../../components/EmptyState';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function CalificacionFormScreen({ intercambioId: intercambioInicial, solicitudId }) {
  const {
    usuarioActual, intercambiosDeUsuario, intercambioPorId, solicitudPorId,
    servicioPorId, usuarioPorId, crearCalificacion, calificacionesEnviadas,
  } = useData();
  const { volver } = useNav();

  const [intercambioId, setIntercambioId] = useState(intercambioInicial || '');
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState('');

  const completados = useMemo(() => {
    if (!usuarioActual) return [];
    return intercambiosDeUsuario(usuarioActual.id).filter((i) => i.estado === 'Completado');
  }, [usuarioActual, intercambiosDeUsuario]);

  const intercambio = intercambioId ? intercambioPorId(intercambioId) : null;
  const servicio = intercambio ? servicioPorId(intercambio.servicioId) : solicitudId ? servicioPorId(solicitudPorId(solicitudId)?.servicioId) : null;

  let receptorId = null;
  if (intercambio && usuarioActual) {
    receptorId = intercambio.usuarioA === usuarioActual.id ? intercambio.usuarioB : intercambio.usuarioA;
  } else if (solicitudId && usuarioActual) {
    const sol = solicitudPorId(solicitudId);
    if (sol) receptorId = sol.solicitanteId === usuarioActual.id ? sol.proveedorId : sol.solicitanteId;
  }
  const receptor = receptorId ? usuarioPorId(receptorId) : null;

  const yaCalifico = useMemo(() => {
    if (!usuarioActual || !receptorId) return false;
    const enviadas = calificacionesEnviadas(usuarioActual.id);
    if (intercambioId) return enviadas.some((c) => c.intercambioId === intercambioId);
    return false;
  }, [usuarioActual, receptorId, intercambioId, calificacionesEnviadas]);

  const enviar = () => {
    if (!usuarioActual) {
      Alert.alert('Inicia sesión', 'Necesitas una cuenta para calificar.');
      return;
    }
    if (!receptorId) {
      Alert.alert('Elige un intercambio', 'Selecciona el intercambio que quieres calificar.');
      return;
    }
    if (comentario.trim().length < 10) {
      Alert.alert('Comentario muy corto', 'Cuenta brevemente cómo fue tu experiencia (mínimo 10 caracteres).');
      return;
    }
    crearCalificacion({
      servicioId: servicio ? servicio.id : null,
      receptorId,
      estrellas,
      comentario: comentario.trim(),
      intercambioId: intercambioId || null,
    });
    Alert.alert('¡Gracias por calificar!', 'Tu reseña ya es visible para la comunidad.');
    volver();
  };

  return (
    <Screen>
      <Header
        kicker="Comunidad · Reputación"
        title="Calificar intercambio"
        subtitle="Tu opinión ayuda a que la comunidad sea más confiable."
        back
      />

      {!intercambioInicial && !solicitudId ? (
        <>
          <Text style={styles.label}>Intercambio completado *</Text>
          {completados.length === 0 ? (
            <EmptyState
              icon="swap-horizontal-outline"
              title="Sin intercambios completados"
              text="Podrás calificar cuando completes tu primer intercambio."
            />
          ) : (
            completados.map((i) => {
              const s = servicioPorId(i.servicioId);
              const otroId = usuarioActual && i.usuarioA === usuarioActual.id ? i.usuarioB : i.usuarioA;
              const otro = usuarioPorId(otroId);
              const activo = intercambioId === i.id;
              return (
                <Pressable
                  key={i.id}
                  onPress={() => setIntercambioId(i.id)}
                  style={[styles.option, activo && styles.optionActive]}
                >
                  <Avatar initials={otro ? otro.iniciales : '??'} size={38} />
                  <View style={{ flex: 1, marginLeft: spacing.sm + 4 }}>
                    <Text style={styles.optionTitle}>{s ? s.titulo : 'Intercambio'}</Text>
                    <Text style={styles.optionSub}>Con {otro ? otro.nombre : 'un miembro'} · {i.horas} h</Text>
                  </View>
                  <Ionicons
                    name={activo ? 'radio-button-on' : 'radio-button-outline'}
                    size={20}
                    color={activo ? colors.primary : colors.textMuted}
                  />
                </Pressable>
              );
            })
          )}
        </>
      ) : null}

      {receptor ? (
        <View style={styles.receptor}>
          <Avatar initials={receptor.iniciales} size={44} />
          <View style={{ flex: 1, marginLeft: spacing.sm + 4 }}>
            <Text style={styles.receptorLabel}>Calificas a</Text>
            <Text style={styles.receptorName}>{receptor.nombre}</Text>
            <Text style={styles.receptorService}>{servicio ? servicio.titulo : 'Intercambio de tiempo'}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.estrellasCard}>
        <Text style={styles.estrellasLabel}>¿Cómo fue tu experiencia?</Text>
        <RatingStars value={estrellas} size={34} onChange={setEstrellas} />
        <Text style={styles.estrellasValor}>
          {['Muy mala', 'Mala', 'Regular', 'Buena', 'Excelente'][estrellas - 1]}
        </Text>
      </View>

      <Text style={styles.label}>Comentario *</Text>
      <View style={styles.areaBox}>
        <TextInput
          style={styles.area}
          value={comentario}
          onChangeText={setComentario}
          multiline
          placeholder="¿Qué tal estuvo la sesión? ¿La persona fue puntual y clara?"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <InfoBox
        text="Las calificaciones son públicas y no se pueden editar después de enviarlas. Sé respetuoso y honesto."
      />

      {yaCalifico ? (
        <InfoBox tone="warning" text="Ya enviaste una calificación para este intercambio." />
      ) : null}

      <Button label="Publicar calificación" icon="star-outline" onPress={enviar} disabled={yaCalifico} />
      <Button label="Cancelar" variant="outline" onPress={volver} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.xs, marginTop: spacing.sm },
  option: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.sm + 4, marginBottom: spacing.sm,
  },
  optionActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optionTitle: { fontSize: 13, fontWeight: '700', color: colors.text },
  optionSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  receptor: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginTop: spacing.md,
  },
  receptorLabel: { fontSize: 10, color: colors.textMuted },
  receptorName: { fontSize: 15, fontWeight: '800', color: colors.text },
  receptorService: { fontSize: 11, color: colors.primary },
  estrellasCard: {
    alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginTop: spacing.md,
  },
  estrellasLabel: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  estrellasValor: { fontSize: 12, fontWeight: '700', color: colors.gold, marginTop: spacing.sm },
  areaBox: {
    backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1,
    borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: 10,
  },
  area: { minHeight: 96, fontSize: 14, color: colors.text, textAlignVertical: 'top' },
});
