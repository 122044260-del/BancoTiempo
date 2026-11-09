import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminScreen from '../../components/AdminScreen';
import AdminHeader from '../../components/AdminHeader';
import AdminButton from '../../components/AdminButton';
import SearchBar from '../../components/SearchBar';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';
import SegmentedTabs from '../../components/SegmentedTabs';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function CategoriasScreen() {
  const { categorias, habilidadesDeCategoria, actualizarCategoria } = useData();
  const { navegar } = useNav();
  const [texto, setTexto] = useState('');
  const [seccion, setSeccion] = useState('categorias');

  const lista = useMemo(
    () => categorias.filter((c) => !texto.trim() || c.nombre.toLowerCase().includes(texto.trim().toLowerCase())),
    [categorias, texto]
  );

  return (
    <AdminScreen active="Catálogo">
      <AdminHeader
        kicker="Administrador · Catálogo"
        title="Categorías y habilidades"
        subtitle="Organiza los talentos que ofrece la comunidad."
      />

      <SegmentedTabs
        tone="admin"
        options={[
          { label: 'Categorías', value: 'categorias' },
          { label: 'Habilidades', value: 'habilidades' },
        ]}
        value={seccion}
        onChange={(v) => (v === 'habilidades' ? navegar('Habilidades') : setSeccion(v))}
      />

      <AdminButton label="Nueva categoría" icon="add-circle-outline" onPress={() => navegar('CategoriaForm')} />

      <SearchBar value={texto} onChangeText={setTexto} placeholder="Buscar categoría" />

      <Text style={styles.count}>
        {lista.length} {lista.length === 1 ? 'categoría' : 'categorías'}
      </Text>

      {lista.length === 0 ? (
        <EmptyState icon="albums-outline" title="Sin categorías" text="Crea la primera categoría del catálogo." />
      ) : (
        lista.map((c) => {
          const habilidades = habilidadesDeCategoria(c.id);
          return (
            <Pressable
              key={c.id}
              style={styles.card}
              onPress={() => navegar('CategoriaDetalle', { id: c.id })}
            >
              <View style={[styles.iconBox, { backgroundColor: c.activa ? colors.adminSoft : colors.background }]}>
                <Ionicons name={c.icono} size={22} color={c.activa ? colors.admin : colors.textMuted} />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.sm + 4 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.nombre}>{c.nombre}</Text>
                  <Badge label={c.activa ? 'Activa' : 'Inactiva'} tone={c.activa ? 'success' : 'warning'} />
                </View>
                <Text style={styles.desc} numberOfLines={1}>{c.descripcion}</Text>
                <Text style={styles.meta}>{habilidades.length} habilidades vinculadas</Text>
              </View>
              <Switch
                value={c.activa}
                onValueChange={(v) => actualizarCategoria(c.id, { activa: v })}
                trackColor={{ true: colors.admin }}
              />
            </Pressable>
          );
        })
      )}

      <AdminButton
        label="Ver todas las habilidades"
        variant="outline"
        icon="pricetags-outline"
        onPress={() => navegar('Habilidades')}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  count: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.sm },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  iconBox: {
    width: 42, height: 42, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nombre: { fontSize: 14, fontWeight: '700', color: colors.text, flex: 1, marginRight: spacing.xs },
  desc: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  meta: { fontSize: 10, color: colors.admin, fontWeight: '600', marginTop: 3 },
});
