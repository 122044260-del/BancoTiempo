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

const roles = ['Usuario general', 'Administrador'];
const estados = ['Activo', 'Suspendido'];

export default function UsuarioFormScreen({ id }) {
  const { usuarioPorId, crearUsuario, actualizarUsuario } = useData();
  const { volver, reemplazar } = useNav();
  const usuario = id ? usuarioPorId(id) : null;
  const editando = !!usuario;

  const [nombre, setNombre] = useState(usuario ? usuario.nombre : '');
  const [correo, setCorreo] = useState(usuario ? usuario.correo : '');
  const [telefono, setTelefono] = useState(usuario ? usuario.telefono : '');
  const [ubicacion, setUbicacion] = useState(usuario ? usuario.ubicacion : '');
  const [rol, setRol] = useState(usuario ? usuario.rol : 'Usuario general');
  const [estado, setEstado] = useState(usuario ? usuario.estado : 'Activo');
  const [contrasena, setContrasena] = useState('12345678');

  const guardar = () => {
    if (nombre.trim().length < 3) {
      Alert.alert('Nombre incompleto', 'Escribe el nombre completo del usuario.');
      return;
    }
    if (!correo.includes('@')) {
      Alert.alert('Correo inválido', 'Escribe un correo electrónico válido.');
      return;
    }
    if (!editando && contrasena.length < 8) {
      Alert.alert('Contraseña corta', 'La contraseña temporal debe tener al menos 8 caracteres.');
      return;
    }

    const datos = {
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      ubicacion: ubicacion.trim(),
      rol,
      estado,
    };

    if (editando) {
      actualizarUsuario(usuario.id, datos);
      Alert.alert('Usuario actualizado', 'Los datos se guardaron correctamente.');
      volver();
    } else {
      const nuevo = crearUsuario({ ...datos, contrasena, bio: 'Miembro de la comunidad.' });
      Alert.alert('Usuario creado', `Se creó la cuenta con la contraseña temporal: ${contrasena}`);
      reemplazar('UsuarioDetalle', { id: nuevo.id });
    }
  };

  return (
    <AdminScreen active="Usuarios">
      <AdminHeader
        kicker="Administrador · Usuarios"
        title={editando ? 'Editar usuario' : 'Crear usuario'}
        subtitle={editando ? 'Actualiza los datos de la cuenta.' : 'Registra a un nuevo miembro de la comunidad.'}
        back
      />

      <SectionTitle title="Datos de la persona" />
      <Field label="Nombre completo *" value={nombre} onChangeText={setNombre} placeholder="Diego Ramírez" />
      <Field
        label="Correo electrónico *"
        value={correo}
        onChangeText={setCorreo}
        icon="mail-outline"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="diego@correo.mx"
      />
      <Field label="Teléfono" value={telefono} onChangeText={setTelefono} icon="call-outline" keyboardType="phone-pad" />
      <Field label="Ubicación" value={ubicacion} onChangeText={setUbicacion} icon="location-outline" />

      {!editando ? (
        <Field
          label="Contraseña temporal *"
          value={contrasena}
          onChangeText={setContrasena}
          icon="key-outline"
          hint="La persona podrá cambiarla después."
        />
      ) : null}

      <SectionTitle title="Permisos y estado" />
      <Text style={styles.label}>Rol</Text>
      <View style={styles.wrap}>
        {roles.map((r) => (
          <Chip key={r} label={r} active={rol === r} onPress={() => setRol(r)} tone="admin" />
        ))}
      </View>

      <Text style={styles.label}>Estado de la cuenta</Text>
      <View style={styles.wrap}>
        {estados.map((e) => (
          <Chip key={e} label={e} active={estado === e} onPress={() => setEstado(e)} tone="admin" />
        ))}
      </View>

      <InfoBox
        text={
          editando
            ? 'Suspender una cuenta impide que la persona inicie sesión, pero conserva su historial.'
            : 'Al crear la cuenta la persona recibe 5 créditos de bienvenida automáticamente.'
        }
      />

      <AdminButton label={editando ? 'Guardar cambios' : 'Crear usuario'} icon="checkmark-circle-outline" onPress={guardar} />
      <AdminButton label="Cancelar" variant="outline" onPress={volver} />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.xs },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
});
