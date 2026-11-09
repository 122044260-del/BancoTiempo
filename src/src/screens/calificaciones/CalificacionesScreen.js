import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserScreen from '../../components/UserScreen';
import Header from '../../components/Header';
import SegmentedTabs from '../../components/SegmentedTabs';
import Avatar from '../../components/Avatar';
import RatingStars from '../../components/RatingStars';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function CalificacionesScreen() {
  const {
    usuarioActual, calificacionesDeUsuario, calificacionesEnviadas,
    usuarioPorId, servicioPorId, promedioUsuario,
  } = useData();
  const { navegar } = useNav();
  const [vista, setVista] = useState('recibidas');

  const recibidas = usuarioActual ? calificacionesDeUsuario(usuarioActual.id) : [];
  const enviadas = usuarioActual ? calificacionesEnviadas(usuarioActual.id) : [];
  const lista = vista === 'recibidas' ? recibidas : enviadas;
  const promedio = usuarioActual ? promedioUsuario(usuarioActual.id) : 0;

  return (
    <UserScreen active="Perfil">
      <Header
        kicker="Comunidad · Reputación"
        title="Calificaciones"
        subtitle="La confianza se construye intercambio a intercambio."
        back
      />

      <View style={styles.resumen}>
        <View style={{ flex: 1 }}>
          <Text style={styles.resumenLabel}>Promedio recibido</Text>
          <Text style={styles.resumenValue}>{promedio ? promedio.toFixed(1) : '—'} / 5</Text>
          <Text style={styles.resumenSub}>{recibidas.length} calificaciones recibidas</Text>
        </View>
        <View style={styles.estrellas}>
          <RatingStars value={promedio} size={20} />
        </View>
      </View>

      <SegmentedTabs
        options={[
          { label: 'Recibidas', value: 'recibidas' },
          { label: 'Enviadas', value: 'enviadas' },
        ]}
        value={vista}
        onChange={setVista}
      />

      <Button label="Calificar un intercambio" icon="star-outline" onPress={() => navegar('CalificacionForm')} />

      <Text style={styles.count}>
        {lista.length} {lista.length === 1 ? 'calificación' : 'calificaciones'}
      </Text>

      {lista.length === 0 ? (
        <EmptyState
          icon="star-outline"
          title="Sin calificaciones"
          text={
            vista === 'recibidas'
              ? 'Completa intercambios para recibir reseñas de la comunidad.'
              : 'Califica tus intercambios completados para ayudar a otros.'
          }
        />
      ) : (
        lista.map((c) => {
          const personaId = vista === 'recibidas' ? c.emisorId : c.receptorId;
          const persona = usuarioPorId(personaId);
          const servicio = servicioPorId(c.servicioId);
          return (
            <View key={c.id} style={styles.card}>
              <View style={styles.top}>
                <Avatar initials={persona ? persona.iniciales : '??'} size={40} />
                <View style={{ flex: 1, marginLeft: spacing.sm + 4 }}>
                  <Text style={styles.nombre}>{persona ? persona.nombre : 'Miembro'}</Text>
                  <Text style={styles.servicio}>{servicio ? servicio.titulo : 'Servicio'}</Text>
                </View>
                <RatingStars value={c.estrellas} size={14} />
              </View>
              <Text style={styles.comentario}>“{c.comentario}”</Text>
              <View style={styles.fechaRow}>
                <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
                <Text style={styles.fecha}>{c.fecha}</Text>
              </View>
            </View>
          );
        })
      )}
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  resumen: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  resumenLabel: { fontSize: 11, color: colors.textMuted },
  resumenValue: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 2 },
  resumenSub: { fontSize: 11, color: colors.textMuted },
  estrellas: {
    width: 58, height: 58, borderRadius: 29, backgroundColor: colors.goldSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  count: { fontSize: 12, color: colors.textMuted, marginTop: spacing.md, marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm + 4,
  },
  top: { flexDirection: 'row', alignItems: 'center' },
  nombre: { fontSize: 14, fontWeight: '700', color: colors.text },
  servicio: { fontSize: 11, color: colors.primary, marginTop: 1 },
  comentario: { fontSize: 13, color: colors.text, lineHeight: 19, marginTop: spacing.sm, fontStyle: 'italic' },
  fechaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  fecha: { fontSize: 10, color: colors.textMuted, marginLeft: 4 },
});
