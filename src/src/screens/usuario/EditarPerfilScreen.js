import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Screen from '../../components/Screen';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';
import Field from '../../components/Field';
import Button from '../../components/Button';
import InfoBox from '../../components/InfoBox';
import SectionTitle from '../../components/SectionTitle';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function EditarPerfilScreen() {
  const { usuarioActual, actualizarPerfil } = useData();
  const { volver } = useNav();
  const usuario = usuarioActual || { nombre: 'Ana Martínez', iniciales: 'AM' };

  const [nombre, setNombre] = useState(usuario.nombre || '');
  const [telefono, setTelefono] = useState(usuario.telefono || '');
  const [ubicacion, setUbicacion] = useState(usuario.ubicacion || '');
  const [bio, setBio] = useState(usuario.bio || '');
  const [correo, setCorreo] = useState(usuario.correo || '');

  const guardar = () => {
    if (nombre.trim().length < 3) {
      Alert.alert('Nombre incompleto', 'Escribe tu nombre completo.');
      return;
    }
    if (!correo.includes('@')) {
      Alert.alert('Correo inválido', 'Revisa tu correo electrónico.');
      return;
    }
    actualizarPerfil({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      ubicacion: ubicacion.trim(),
      bio: bio.trim(),
      correo: correo.trim(),
    });
    Alert.alert('Perfil actualizado', 'Tus datos se guardaron correctamente.');
    volver();
  };

  return (
    <Screen>
      <Header
        kicker="Mi cuenta"
        title="Editar perfil"
        subtitle="Actualiza tus datos de contacto y tu presentación."
        back
      />

      <View style={styles.photoRow}>
        <Avatar initials={usuario.iniciales || 'AM'} size={56} />
        <View style={{ marginLeft: spacing.md }}>
          <Text style={styles.photoTitle}>Foto de perfil</Text>
          <Text style={styles.photoSub}>Las iniciales se actualizan con tu nombre.</Text>
        </View>
      </View>

      <SectionTitle title="Datos personales" />
      <Field label="Nombre completo *" value={nombre} onChangeText={setNombre} />
      <Field
        label="Correo electrónico *"
        value={correo}
        onChangeText={setCorreo}
        icon="mail-outline"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Field label="Teléfono" value={telefono} onChangeText={setTelefono} icon="call-outline" keyboardType="phone-pad" />
      <Field label="Ubicación" value={ubicacion} onChangeText={setUbicacion} icon="location-outline" />

      <SectionTitle title="Sobre mí" />
      <Field
        label="Biografía"
        value={bio}
        onChangeText={setBio}
        multiline
        hint="Cuéntale a la comunidad qué sabes hacer y qué te gustaría aprender."
      />

      <InfoBox
        tone="warning"
        text="Tu correo se usa para iniciar sesión. Si lo cambias, deberás usarlo la próxima vez."
      />

      <Button label="Guardar cambios" icon="save-outline" onPress={guardar} />
      <Button label="Cancelar" variant="outline" onPress={volver} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  photoRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  photoTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  photoSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
});
