import React, { useState } from 'react';
import { View, Text, Switch, Pressable, StyleSheet, Alert } from 'react-native';
import Screen from '../../components/Screen';
import Header from '../../components/Header';
import Avatar from '../../components/Avatar';
import Field from '../../components/Field';
import Button from '../../components/Button';
import InfoBox from '../../components/InfoBox';
import { colors, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function RegistroScreen() {
  const { registrarse } = useData();
  const { navegar, reiniciar } = useNav();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [acepta, setAcepta] = useState(true);

  const crearCuenta = () => {
    if (nombre.trim().length < 3) {
      Alert.alert('Falta tu nombre', 'Escribe tu nombre completo.');
      return;
    }
    if (!correo.includes('@')) {
      Alert.alert('Correo inválido', 'Escribe un correo electrónico válido.');
      return;
    }
    if (contrasena.length < 8) {
      Alert.alert('Contraseña corta', 'Usa al menos 8 caracteres.');
      return;
    }
    if (!acepta) {
      Alert.alert('Términos', 'Debes aceptar los términos para crear tu cuenta.');
      return;
    }

    const resultado = registrarse({
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      contrasena,
      ubicacion: ubicacion.trim() || 'Querétaro',
    });

    if (!resultado.ok) {
      Alert.alert('No se pudo crear la cuenta', resultado.error);
      return;
    }

    Alert.alert('¡Bienvenida!', 'Tu cuenta se creó con 5 créditos de regalo.');
    reiniciar('Inicio');
  };

  return (
    <Screen>
      <Header
        kicker="Comunidad · Registro"
        title="Únete a la comunidad"
        subtitle="Crea tu cuenta de usuario general."
        back
      />

      <View style={styles.photoRow}>
        <Avatar initials="AM" size={44} />
        <Text style={styles.photoLink}>Agregar foto de perfil</Text>
      </View>

      <Field label="Nombre completo *" value={nombre} onChangeText={setNombre} placeholder="Ana Martínez" />
      <Field
        label="Correo electrónico *"
        value={correo}
        onChangeText={setCorreo}
        icon="mail-outline"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="ana@correo.mx"
      />
      <Field label="Teléfono" value={telefono} onChangeText={setTelefono} icon="call-outline" keyboardType="phone-pad" />
      <Field
        label="Contraseña *"
        value={contrasena}
        onChangeText={setContrasena}
        icon="eye-off-outline"
        secure
        hint="Mínimo 8 caracteres."
      />
      <Field label="Ubicación" value={ubicacion} onChangeText={setUbicacion} icon="location-outline" placeholder="Centro, Querétaro" />

      <InfoBox
        tone="success"
        text="Recibirás 5 créditos de bienvenida al activar tu cuenta. Podrás gastarlos desde el primer día."
      />

      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchTitle}>Acepto los términos y privacidad</Text>
          <Text style={styles.switchSub}>Consulta las reglas del Banco de Tiempo.</Text>
        </View>
        <Switch value={acepta} onValueChange={setAcepta} trackColor={{ true: colors.success }} />
      </View>

      <Button label="Crear cuenta" icon="person-add-outline" onPress={crearCuenta} />

      <Pressable onPress={() => navegar('IniciarSesion')} hitSlop={8}>
        <Text style={styles.footer}>Ya tengo cuenta · Iniciar sesión</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  photoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  photoLink: { marginLeft: spacing.sm + 4, fontSize: 13, fontWeight: '700', color: colors.primary },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  switchTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  switchSub: { fontSize: 11, color: colors.textMuted },
  footer: { textAlign: 'center', fontSize: 12, color: colors.primary, marginTop: spacing.md },
});
