import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminScreen from '../../components/AdminScreen';
import AdminHeader from '../../components/AdminHeader';
import AdminButton from '../../components/AdminButton';
import Badge from '../../components/Badge';
import SectionTitle from '../../components/SectionTitle';
import DetailRow from '../../components/DetailRow';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function CategoriaDetalleScreen({ id }) {
  const {
    categoriaPorId, habilidadesDeCategoria, serviciosDeCategoria,
    actualizarCategoria, eliminarCategoria,
  } = useData();
  const { navegar, volver } = useNav();
  const [confirmar, setConfirmar] = useState(false);

  const categoria = categoriaPorId(id);
  if (!categoria) {
    return (
      <AdminScreen active="Catálogo">
        <AdminHeader title="Categoría" back />
        <EmptyState icon="alert-circle-outline" title="Categoría no encontrada" text="Puede que se haya eliminado." />
      </AdminScreen>
    );
  }

  const habilidades = habilidadesDeCategoria(categoria.id);
  const servicios = serviciosDeCategoria(categoria.id);

  const borrar = () => {
    eliminarCategoria(categoria.id);
    setConfirmar(false);
    Alert.alert('Categoría eliminada', 'Las habilidades vinculadas quedaron sin categoría.');
    volver();
  };

  return (
    <AdminScreen active="Catálogo">
      <AdminHeader kicker="Administrador · Catálogo" title="Detalle de categoría" back />

      <View style={styles.hero}>
        <View style={styles.iconBig}>
          <Ionicons name={categoria.icono} size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.nombre}>{categoria.nombre}</Text>
        <Text style={styles.desc}>{categoria.descripcion}</Text>
        <View style={styles.badges}>
          <Badge label={categoria.activa ? 'Activa' : 'Inactiva'} tone={categoria.activa ? 'success' : 'warning'} />
          <View style={{ width: 6 }} />
          <Badge label={`${habilidades.length} habilidades`} tone="info" />
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{habilidades.length}</Text>
          <Text style={styles.statLabel}>Habilidades</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{servicios.length}</Text>
          <Text style={styles.statLabel}>Servicios activos</Text>
        </View>
      </View>

      <SectionTitle
        title="Habilidades de la categoría"
        action="Agregar"
        onAction={() => navegar('HabilidadForm', { categoriaId: categoria.id })}
      />
      {habilidades.length === 0 ? (
        <EmptyState icon="pricetags-outline" title="Sin habilidades" text="Agrega la primera habilidad de esta categoría." />
      ) : (
        habilidades.map((h) => {
          const enServicios = servicios.filter((s) => s.habilidadId === h.id).length;
          return (
            <Pressable key={h.id} style={styles.item} onPress={() => navegar('HabilidadDetalle', { id: h.id })}>
              <View style={styles.itemIcon}>
                <Ionicons name="pricetag-outline" size={17} color={colors.admin} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{h.nombre}</Text>
                <Text style={styles.itemSub}>{h.nivel} · {enServicios} servicios</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </Pressable>
          );
        })
      )}

      <SectionTitle title="Información" />
      <View style={styles.card}>
        <DetailRow label="Nombre" value={categoria.nombre} icon="albums-outline" tone="admin" />
        <DetailRow label="Ícono" value={categoria.icono} icon="image-outline" tone="admin" />
        <DetailRow label="Estado" value={categoria.activa ? 'Activa' : 'Inactiva'} icon="toggle-outline" tone="admin" />
      </View>

      <AdminButton label="Editar categoría" icon="create-outline" onPress={() => navegar('CategoriaForm', { id: categoria.id })} />
      <AdminButton
        label={categoria.activa ? 'Desactivar categoría' : 'Activar categoría'}
        variant="outline"
        icon={categoria.activa ? 'pause-circle-outline' : 'play-circle-outline'}
        onPress={() => {
          actualizarCategoria(categoria.id, { activa: !categoria.activa });
          Alert.alert('Estado actualizado', 'El cambio se aplicó al catálogo.');
        }}
      />
      <AdminButton label="Eliminar categoría" variant="danger" icon="trash-outline" onPress={() => setConfirmar(true)} />

      <ConfirmDialog
        visible={confirmar}
        title="Eliminar categoría"
        message={`¿Deseas eliminar «${categoria.nombre}»? Las ${habilidades.length} habilidades vinculadas quedarán sin categoría.`}
        confirmLabel="Sí, eliminar"
        onConfirm={borrar}
        onCancel={() => setConfirmar(false)}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.admin, borderRadius: radius.lg, padding: spacing.lg,
  },
  iconBig: {
    width: 60, height: 60, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  nombre: { fontSize: 23, fontWeight: '800', color: '#FFFFFF', marginTop: spacing.md },
  desc: { fontSize: 12, color: '#E0E7FF', marginTop: 2, lineHeight: 18 },
  badges: { flexDirection: 'row', marginTop: spacing.md },
  stats: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginTop: spacing.sm + 4,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.admin },
  statLabel: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  divider: { width: 1, height: 26, backgroundColor: colors.border },
  item: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.sm + 4, marginBottom: spacing.sm,
  },
  itemIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: colors.adminSoft,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm + 4,
  },
  itemTitle: { fontSize: 13, fontWeight: '700', color: colors.text },
  itemSub: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
});
