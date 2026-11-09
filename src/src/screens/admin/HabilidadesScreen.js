import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminScreen from '../../components/AdminScreen';
import AdminHeader from '../../components/AdminHeader';
import AdminButton from '../../components/AdminButton';
import SearchBar from '../../components/SearchBar';
import Chip from '../../components/Chip';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function HabilidadesScreen() {
  const { habilidades, categorias, categoriaPorId, servicios } = useData();
  const { navegar } = useNav();
  const [texto, setTexto] = useState('');
  const [categoriaId, setCategoriaId] = useState('todas');

  const lista = useMemo(
    () =>
      habilidades.filter((h) => {
        const q = texto.trim().toLowerCase();
        const coincideTexto = !q || h.nombre.toLowerCase().includes(q);
        const coincideCategoria = categoriaId === 'todas' || h.categoriaId === categoriaId;
        return coincideTexto && coincideCategoria;
      }),
    [habilidades, texto, categoriaId]
  );

  return (
    <AdminScreen active="Catálogo">
      <AdminHeader
        kicker="Administrador · Catálogo"
        title="Habilidades"
        subtitle="Cada habilidad se conecta con una categoría y con servicios."
        back
      />

      <AdminButton label="Nueva habilidad" icon="add-circle-outline" onPress={() => navegar('HabilidadForm')} />

      <SearchBar value={texto} onChangeText={setTexto} placeholder="Buscar habilidad" />

      <Text style={styles.label}>Filtrar por categoría</Text>
      <View style={styles.wrap}>
        <Chip label="Todas" active={categoriaId === 'todas'} onPress={() => setCategoriaId('todas')} tone="admin" />
        {categorias.map((c) => (
          <Chip
            key={c.id}
            label={c.nombre}
            active={categoriaId === c.id}
            onPress={() => setCategoriaId(c.id)}
            tone="admin"
          />
        ))}
      </View>

      <Text style={styles.count}>
        {lista.length} {lista.length === 1 ? 'habilidad' : 'habilidades'}
      </Text>

      {lista.length === 0 ? (
        <EmptyState icon="pricetags-outline" title="Sin habilidades" text="No hay habilidades que coincidan con el filtro." />
      ) : (
        lista.map((h) => {
          const cat = categoriaPorId(h.categoriaId);
          const enServicios = servicios.filter((s) => s.habilidadId === h.id).length;
          return (
            <Pressable key={h.id} style={styles.card} onPress={() => navegar('HabilidadDetalle', { id: h.id })}>
              <View style={styles.iconBox}>
                <Ionicons name={cat ? cat.icono : 'pricetag-outline'} size={20} color={colors.admin} />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.sm + 4 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.nombre}>{h.nombre}</Text>
                  <Badge label={h.nivel} tone="info" />
                </View>
                <Text style={styles.cat}>{cat ? cat.nombre : 'Sin categoría'}</Text>
                <Text style={styles.meta}>{enServicios} servicios publicados</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          );
        })
      )}

      <AdminButton
        label="Gestionar categorías"
        variant="outline"
        icon="albums-outline"
        onPress={() => navegar('Categorias')}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.xs },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  count: { fontSize: 11, color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.sm },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  iconBox: {
    width: 42, height: 42, borderRadius: radius.md, backgroundColor: colors.adminSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nombre: { fontSize: 14, fontWeight: '700', color: colors.text, flex: 1, marginRight: spacing.xs },
  cat: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  meta: { fontSize: 10, color: colors.admin, fontWeight: '600', marginTop: 3 },
});
