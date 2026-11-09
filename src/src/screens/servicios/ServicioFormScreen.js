import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Header from '../../components/Header';
import Field from '../../components/Field';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import InfoBox from '../../components/InfoBox';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

const modalidades = ['En línea', 'Presencial', 'Híbrido'];
const estados = ['Activo', 'Pausado', 'En revisión'];

export default function ServicioFormScreen({ id, habilidadId: habilidadInicial }) {
  const {
    servicioPorId, habilidades, categoriaPorId, crearServicio, actualizarServicio, usuarioActual,
  } = useData();
  const { volver, reemplazar } = useNav();
  const servicio = id ? servicioPorId(id) : null;
  const editando = !!servicio;

  const [titulo, setTitulo] = useState(servicio ? servicio.titulo : '');
  const [habilidadId, setHabilidadId] = useState(
    servicio
      ? servicio.habilidadId
      : habilidadInicial || (habilidades[0] ? habilidades[0].id : '')
  );
  const [horas, setHoras] = useState(servicio ? String(servicio.horas) : '1');
  const [modalidad, setModalidad] = useState(servicio ? servicio.modalidad : 'En línea');
  const [estado, setEstado] = useState(servicio ? servicio.estado : 'Activo');
  const [descripcion, setDescripcion] = useState(servicio ? servicio.descripcion : '');

  const guardar = () => {
    if (titulo.trim().length < 4) {
      Alert.alert('Título muy corto', 'Escribe un título claro para tu servicio.');
      return;
    }
    if (!habilidadId) {
      Alert.alert('Falta la habilidad', 'Selecciona la habilidad que ofrece tu servicio.');
      return;
    }
    const numeroHoras = Number(horas);
    if (!numeroHoras || numeroHoras <= 0) {
      Alert.alert('Horas inválidas', 'Indica cuántas horas dura el servicio.');
      return;
    }

    const datos = {
      titulo: titulo.trim(),
      habilidadId,
      horas: numeroHoras,
      modalidad,
      estado,
      descripcion: descripcion.trim(),
      usuarioId: servicio ? servicio.usuarioId : usuarioActual ? usuarioActual.id : 'u1',
    };

    if (editando) {
      actualizarServicio(servicio.id, datos);
      Alert.alert('Servicio actualizado', 'Los cambios se guardaron correctamente.');
      volver();
    } else {
      const nuevo = crearServicio({ ...datos, fecha: new Date().toISOString().slice(0, 10) });
      Alert.alert('Servicio publicado', 'Tu servicio ya aparece en el catálogo.');
      reemplazar('ServicioDetalle', { id: nuevo.id });
    }
  };

  return (
    <Screen>
      <Header
        kicker="Catálogo · Servicios"
        title={editando ? 'Editar servicio' : 'Nuevo servicio'}
        subtitle="Describe con claridad lo que ofreces a la comunidad."
        back
      />

      <Field
        label="Título del servicio *"
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ej. Clases de guitarra"
      />

      <Text style={styles.label}>Habilidad *</Text>
      <View style={styles.wrap}>
        {habilidades.map((h) => {
          const cat = categoriaPorId(h.categoriaId);
          return (
            <Chip
              key={h.id}
              label={cat ? `${h.nombre} · ${cat.nombre}` : h.nombre}
              active={habilidadId === h.id}
              onPress={() => setHabilidadId(h.id)}
            />
          );
        })}
      </View>

      <Field
        label="Horas que dura *"
        value={horas}
        onChangeText={setHoras}
        keyboardType="decimal-pad"
        icon="timer-outline"
        hint="1 hora equivale a 1 crédito de tiempo."
      />

      <Text style={styles.label}>Modalidad</Text>
      <View style={styles.wrap}>
        {modalidades.map((m) => (
          <Chip key={m} label={m} active={modalidad === m} onPress={() => setModalidad(m)} />
        ))}
      </View>

      <Text style={styles.label}>Estado de la publicación</Text>
      <View style={styles.wrap}>
        {estados.map((e) => (
          <Chip
            key={e}
            label={e}
            active={estado === e}
            onPress={() => setEstado(e)}
          />
        ))}
      </View>

      <Text style={styles.label}>Descripción</Text>
      <View style={styles.areaBox}>
        <TextInput
          style={styles.area}
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          placeholder="Explica qué incluye, a quién va dirigido y cómo se coordina la sesión."
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <InfoBox text="Los servicios con estado «En revisión» serán revisados por la administración antes de publicarse." />

      <Button label={editando ? 'Guardar cambios' : 'Publicar servicio'} icon="checkmark-circle-outline" onPress={guardar} />
      <Button label="Cancelar" variant="outline" onPress={volver} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.xs, marginTop: spacing.xs },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  areaBox: {
    backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1,
    borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: 10,
    marginBottom: spacing.sm,
  },
  area: { minHeight: 90, fontSize: 14, color: colors.text, textAlignVertical: 'top' },
});
