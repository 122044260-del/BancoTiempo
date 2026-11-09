import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AdminScreen from '../../components/AdminScreen';
import AdminHeader from '../../components/AdminHeader';
import AdminButton from '../../components/AdminButton';
import Field from '../../components/Field';
import Chip from '../../components/Chip';
import InfoBox from '../../components/InfoBox';
import SectionTitle from '../../components/SectionTitle';
import { colors, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

const niveles = ['Básico', 'Intermedio', 'Avanzado'];

export default function HabilidadFormScreen({ id, categoriaId: categoriaInicial }) {
  const { habilidadPorId, crearHabilidad, actualizarHabilidad, categorias } = useData();
  const { volver, reemplazar } = useNav();
  const habilidad = id ? habilidadPorId(id) : null;
  const editando = !!habilidad;

  const [nombre, setNombre] = useState(habilidad ? habilidad.nombre : '');
  const [categoriaId, setCategoriaId] = useState(
    habilidad ? habilidad.categoriaId : categoriaInicial || (categorias[0] ? categorias[0].id : '')
  );
  const [nivel, setNivel] = useState(habilidad ? habilidad.nivel : 'Intermedio');
  const [descripcion, setDescripcion] = useState(habilidad ? habilidad.descripcion : '');

  const guardar = () => {
    if (nombre.trim().length < 3) {
      Alert.alert('Nombre incompleto', 'Escribe el nombre de la habilidad.');
      return;
    }
    if (!categoriaId) {
      Alert.alert('Falta la categoría', 'Selecciona la categoría a la que pertenece.');
      return;
    }
    const datos = { nombre: nombre.trim(), categoriaId, nivel, descripcion: descripcion.trim() };

    if (editando) {
      actualizarHabilidad(habilidad.id, datos);
      Alert.alert('Habilidad actualizada', 'Los cambios se guardaron.');
      volver();
    } else {
      const nueva = crearHabilidad(datos);
      Alert.alert('Habilidad creada', 'Ya puedes asociarla a nuevos servicios.');
      reemplazar('HabilidadDetalle', { id: nueva.id });
    }
  };

  return (
    <AdminScreen active="Catálogo">
      <AdminHeader
        kicker="Administrador · Catálogo"
        title={editando ? 'Editar habilidad' : 'Nueva habilidad'}
        subtitle="Las habilidades describen lo que un miembro puede enseñar."
        back
      />

      <SectionTitle title="Datos de la habilidad" />
      <Field label="Nombre *" value={nombre} onChangeText={setNombre} placeholder="Ej. Guitarra" />

      <Text style={styles.label}>Categoría *</Text>
      <View style={styles.wrap}>
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

      <Text style={styles.label}>Nivel</Text>
      <View style={styles.wrap}>
        {niveles.map((n) => (
          <Chip key={n} label={n} active={nivel === n} onPress={() => setNivel(n)} tone="admin" />
        ))}
      </View>

      <Field
        label="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        placeholder="¿Qué incluye esta habilidad? ¿Para quién es?"
      />

      <InfoBox
        text="Las habilidades permiten relacionar los servicios con una categoría. Un servicio siempre debe tener una habilidad."
      />

      <AdminButton label={editando ? 'Guardar cambios' : 'Crear habilidad'} icon="checkmark-circle-outline" onPress={guardar} />
      <AdminButton label="Cancelar" variant="outline" onPress={volver} />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.xs },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
});
