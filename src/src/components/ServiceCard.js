import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import { useData } from '../context/DataContext';

// Tarjeta de servicio reutilizada en Inicio, Explorar, Favoritos y Servicios.
export default function ServiceCard({ servicio, onPress, onFavorito, mostrarAutor = true }) {
  const { categoriaDeServicio, usuarioPorId, esFavorito, toggleFavorito } = useData();
  const categoria = categoriaDeServicio(servicio);
  const autor = usuarioPorId(servicio.usuarioId);
  const favorito = esFavorito(servicio.id);

  const alternar = () => {
    if (onFavorito) onFavorito(servicio);
    else toggleFavorito(servicio.id);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.top}>
        <View style={styles.iconBox}>
          <Ionicons name={categoria ? categoria.icono : 'pricetag-outline'} size={22} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{servicio.titulo}</Text>
          {mostrarAutor && autor ? (
            <Text style={styles.author} numberOfLines={1}>{autor.nombre}</Text>
          ) : null}
        </View>
        <Pressable onPress={alternar} hitSlop={8} accessibilityRole="button" accessibilityLabel="Favorito">
          <Ionicons
            name={favorito ? 'heart' : 'heart-outline'}
            size={21}
            color={favorito ? colors.danger : colors.textMuted}
          />
        </Pressable>
      </View>

      <Text style={styles.desc} numberOfLines={2}>{servicio.descripcion}</Text>

      <View style={styles.metaRow}>
        <View style={styles.chip}>
          <Ionicons name="timer-outline" size={13} color={colors.primary} />
          <Text style={styles.chipText}>{servicio.horas} h</Text>
        </View>
        <View style={styles.chip}>
          <Ionicons name="videocam-outline" size={13} color={colors.primary} />
          <Text style={styles.chipText}>{servicio.modalidad}</Text>
        </View>
        {categoria ? (
          <View style={[styles.chip, { backgroundColor: colors.adminSoft }]}>
            <Text style={[styles.chipText, { color: colors.admin }]} numberOfLines={1}>
              {categoria.nombre}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
  },
  top: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 42, height: 42, borderRadius: radius.md, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm + 4,
  },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  author: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  desc: { fontSize: 12, color: colors.textMuted, lineHeight: 18, marginTop: spacing.sm },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  chip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primarySoft,
    borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 4,
    marginRight: spacing.xs + 2, marginBottom: 2, maxWidth: 180,
  },
  chipText: { fontSize: 10, fontWeight: '700', color: colors.primary, marginLeft: 3 },
});
