import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminScreen from '../../components/AdminScreen';
import AdminHeader from '../../components/AdminHeader';
import AdminButton from '../../components/AdminButton';
import Field from '../../components/Field';
import Chip from '../../components/Chip';
import InfoBox from '../../components/InfoBox';
import SectionTitle from '../../components/SectionTitle';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

const iconos = [
  'school-outline', 'home-outline', 'laptop-outline', 'color-palette-outline',
  'heart-outline', 'restaurant-outline', 'construct-outline', 'musical-notes-outline',
  'leaf-outline', 'language-outline', 'camera-outline', 'fitness-outline',
];
const estados = [
  { label: 'Activa', value: true },
  { label: 'Inactiva', value: false },
];

export default function CategoriaFormScreen({ id }) {
  const { categoriaPorId, crearCategoria, actualizarCategoria } = useData();
  const { volver, reemplazar } = useNav();
  const categoria = id ? categoriaPorId(id) : null;
  const editando = !!categoria;

  const [nombre, setNombre] = useState(categoria ? categoria.nombre : '');
  const [descripcion, setDescripcion] = useState(categoria ? categoria.descripcion : '');
  const [icono, setIcono] = useState(categoria ? categoria.icono : iconos[0]);
  const [activa, setActiva] = useState(categoria ? categoria.activa : true);

  const guardar = () => {
    if (nombre.trim().length < 3) {
      Alert.alert('Nombre incompleto', 'Escribe el nombre de la categoría.');
      return;
    }
    const datos = { nombre: nombre.trim(), descripcion: descripcion.trim(), icono, activa };

    if (editando) {
      actualizarCategoria(categoria.id, datos);
      Alert.alert('Categoría actualizada', 'Los cambios se guardaron.');
      volver();
    } else {
      const nueva = crearCategoria(datos);
      Alert.alert('Categoría creada', 'Ya puedes vincular habilidades a esta categoría.');
      reemplazar('CategoriaDetalle', { id: nueva.id });
    }
  };

  return (
    <AdminScreen active="Catálogo">
      <AdminHeader
        kicker="Administrador · Catálogo"
        title={editando ? 'Editar categoría' : 'Nueva categoría'}
        subtitle="Las categorías agrupan habilidades y servicios."
        back
      />

      <View style={styles.preview}>
        <View style={styles.previewIcon}>
          <Ionicons name={icono} size={30} color={colors.admin} />
        </View>
        <View style={{ marginLeft: spacing.md }}>
          <Text style={styles.previewName}>{nombre || 'Nombre de la categoría'}</Text>
          <Text style={styles.previewDesc} numberOfLines={2}>
            {descripcion || 'Descripción breve de la categoría'}
          </Text>
        </View>
      </View>

      <SectionTitle title="Datos de la categoría" />
      <Field label="Nombre *" value={nombre} onChangeText={setNombre} placeholder="Ej. Educación" />
      <Field
        label="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        placeholder="¿Qué tipo de servicios agrupa?"
      />

      <Text style={styles.label}>Ícono</Text>
      <View style={styles.iconGrid}>
        {iconos.map((i) => (
          <Pressable
            key={i}
            onPress={() => setIcono(i)}
            style={[styles.iconOption, icono === i && styles.iconActive]}
          >
            <Ionicons name={i} size={20} color={icono === i ? '#FFFFFF' : colors.admin} />
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Estado</Text>
      <View style={styles.wrap}>
        {estados.map((e) => (
          <Chip
            key={String(e.value)}
            label={e.label}
            active={activa === e.value}
            onPress={() => setActiva(e.value)}
            tone="admin"
          />
        ))}
      </View>

      <InfoBox text="Si desactivas una categoría, sus servicios dejarán de mostrarse en las búsquedas de la comunidad." />

      <AdminButton label={editando ? 'Guardar cambios' : 'Crear categoría'} icon="checkmark-circle-outline" onPress={guardar} />
      <AdminButton label="Cancelar" variant="outline" onPress={volver} />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  preview: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md,
  },
  previewIcon: {
    width: 58, height: 58, borderRadius: radius.md, backgroundColor: colors.adminSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  previewName: { fontSize: 16, fontWeight: '800', color: colors.text },
  previewDesc: { fontSize: 11, color: colors.textMuted, marginTop: 2, maxWidth: 220 },
  label: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.xs },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  iconOption: {
    width: 46, height: 46, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm, marginBottom: spacing.sm,
  },
  iconActive: { backgroundColor: colors.admin, borderColor: colors.admin },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
});
