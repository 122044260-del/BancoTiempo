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

export default function HabilidadDetalleScreen({ id }) {
  const {
    habilidadPorId, categoriaPorId, servicios, usuarioPorId, eliminarHabilidad,
  } = useData();
  const { navegar, volver } = useNav();
  const [confirmar, setConfirmar] = useState(false);

  const habilidad = habilidadPorId(id);
  if (!habilidad) {
    return (
      <AdminScreen active="Catálogo">
        <AdminHeader title="Habilidad" back />
        <EmptyState icon="alert-circle-outline" title="Habilidad no encontrada" text="Puede que se haya eliminado." />
      </AdminScreen>
    );
  }

  const categoria = categoriaPorId(habilidad.categoriaId);
  const relacionados = servicios.filter((s) => s.habilidadId === habilidad.id);

  const borrar = () => {
    eliminarHabilidad(habilidad.id);
    setConfirmar(false);
    Alert.alert('Habilidad eliminada', 'Los servicios vinculados conservarán su registro, pero perderán la habilidad.');
    volver();
  };

  return (
    <AdminScreen active="Catálogo">
      <AdminHeader kicker="Administrador · Catálogo" title="Detalle de habilidad" back />

      <View style={styles.hero}>
        <View style={styles.iconBig}>
          <Ionicons name={categoria ? categoria.icono : 'pricetag-outline'} size={30} color="#FFFFFF" />
        </View>
        <Text style={styles.nombre}>{habilidad.nombre}</Text>
        <Text style={styles.cat}>{categoria ? categoria.nombre : 'Sin categoría'}</Text>
        <View style={styles.badges}>
          <Badge label={`Nivel ${habilidad.nivel}`} tone="info" />
          <View style={{ width: 6 }} />
          <Badge label={`${relacionados.length} servicios`} tone="success" />
        </View>
      </View>

      <SectionTitle title="Descripción" />
      <View style={styles.card}>
        <Text style={styles.desc}>{habilidad.descripcion || 'Sin descripción registrada.'}</Text>
      </View>

      <SectionTitle title="Información" />
      <View style={styles.card}>
        <DetailRow label="Categoría" value={categoria ? categoria.nombre : 'Sin categoría'} icon="albums-outline" tone="admin" />
        <DetailRow label="Nivel" value={habilidad.nivel} icon="stats-chart-outline" tone="admin" />
        <DetailRow
          label="Categoría activa"
          value={categoria ? (categoria.activa ? 'Sí' : 'No') : '—'}
          icon="toggle-outline"
          tone="admin"
        />
      </View>

      <SectionTitle
        title="Servicios con esta habilidad"
        action="Ver catálogo"
        onAction={() => navegar('Servicios')}
      />
      {relacionados.length === 0 ? (
        <EmptyState icon="albums-outline" title="Sin servicios" text="Aún no hay servicios publicados con esta habilidad." />
      ) : (
        relacionados.map((s) => {
          const autor = usuarioPorId(s.usuarioId);
          return (
            <Pressable key={s.id} style={styles.item} onPress={() => navegar('ServicioDetalle', { id: s.id })}>
              <View style={styles.itemIcon}>
                <Ionicons name="pricetag-outline" size={17} color={colors.admin} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{s.titulo}</Text>
                <Text style={styles.itemSub}>{autor ? autor.nombre : 'Miembro'} · {s.horas} h · {s.estado}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </Pressable>
          );
        })
      )}

      <AdminButton label="Editar habilidad" icon="create-outline" onPress={() => navegar('HabilidadForm', { id: habilidad.id })} />
      <AdminButton
        label="Crear servicio con esta habilidad"
        variant="outline"
        icon="add-circle-outline"
        onPress={() => navegar('ServicioForm', { habilidadId: habilidad.id })}
      />
      <AdminButton label="Eliminar habilidad" variant="danger" icon="trash-outline" onPress={() => setConfirmar(true)} />

      <ConfirmDialog
        visible={confirmar}
        title="Eliminar habilidad"
        message={`¿Deseas eliminar «${habilidad.nombre}»? Esta acción afecta a ${relacionados.length} servicios vinculados.`}
        confirmLabel="Sí, eliminar"
        onConfirm={borrar}
        onCancel={() => setConfirmar(false)}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.admin, borderRadius: radius.lg, padding: spacing.lg },
  iconBig: {
    width: 58, height: 58, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  nombre: { fontSize: 23, fontWeight: '800', color: '#FFFFFF', marginTop: spacing.md },
  cat: { fontSize: 12, color: '#E0E7FF', marginTop: 2 },
  badges: { flexDirection: 'row', marginTop: spacing.md },
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  desc: { fontSize: 13, color: colors.text, lineHeight: 19, paddingVertical: spacing.sm },
  item: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.sm + 4, marginBottom: spacing.sm,
  },
  itemIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: colors.adminSoft,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm + 4,
  },
  itemTitle: { fontSize: 12, fontWeight: '700', color: colors.text },
  itemSub: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
});
