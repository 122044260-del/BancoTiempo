import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Header from '../../components/Header';
import Field from '../../components/Field';
import Button from '../../components/Button';
import InfoBox from '../../components/InfoBox';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function IniciarSesionScreen() {
  const { iniciarSesion, iniciarSesionComo } = useData();
  const { navegar, reiniciar } = useNav();
  const [correo, setCorreo] = useState('ana.martinez@correo.mx');
  const [contrasena, setContrasena] = useState('12345678');
  const [error, setError] = useState('');

  const entrar = () => {
    const resultado = iniciarSesion(correo, contrasena);
    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    setError('');
    reiniciar(resultado.usuario.rol === 'Administrador' ? 'PanelGlobal' : 'Inicio');
  };

  const accesoRapido = (id) => {
    const usuario = iniciarSesionComo(id);
    if (usuario) {
      reiniciar(usuario.rol === 'Administrador' ? 'PanelGlobal' : 'Inicio');
    }
  };

  return (
    <Screen>
      <Header
        kicker="Comunidad · Acceso"
        title="Qué gusto verte"
        subtitle="Ingresa para continuar con tus intercambios."
        back
      />

      {/* Tarjeta de bienvenida */}
      <View style={styles.hero}>
        <Ionicons name="hand-left-outline" size={26} color={colors.primary} />
        <Text style={styles.heroTitle}>Tu próximo intercambio empieza aquí.</Text>
        <Text style={styles.heroSub}>Banco de Tiempo y Talento</Text>
      </View>

      <Field
        label="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        icon="mail-outline"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Field
        label="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        icon="eye-off-outline"
        secure
      />

      {error ? <InfoBox tone="warning" text={error} /> : null}

      <Pressable onPress={() => navegar('Recuperar')} hitSlop={8}>
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </Pressable>

      <Button label="Iniciar sesión" icon="log-in-outline" onPress={entrar} />

      <InfoBox text="Demostración: usa las cuentas de acceso rápido para entrar como usuario o como administradora." />

      <Text style={styles.rapidoTitulo}>Acceso rápido</Text>
      <Button
        label="Entrar como Ana (usuario)"
        variant="outline"
        icon="person-outline"
        onPress={() => accesoRapido('u1')}
      />
      <Button
        label="Entrar como Lucía (admin)"
        variant="outline"
        icon="shield-checkmark-outline"
        onPress={() => accesoRapido('u4')}
      />

      <Text style={styles.question}>¿Aún no tienes cuenta?</Text>
      <Button label="Crear mi cuenta" variant="outline" onPress={() => navegar('Registro')} />

      <Text style={styles.footer}>Al continuar aceptas los términos de la comunidad y su aviso de privacidad.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.primarySoft, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.md,
  },
  heroTitle: { fontSize: 20, fontWeight: '700', color: colors.primary, marginTop: spacing.sm },
  heroSub: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  link: { fontSize: 13, fontWeight: '700', color: colors.primary, marginTop: spacing.xs, marginBottom: spacing.sm },
  rapidoTitulo: { fontSize: 12, fontWeight: '700', color: colors.textMuted, marginTop: spacing.md },
  question: { textAlign: 'center', fontSize: 13, color: colors.textMuted, marginTop: spacing.md },
  footer: { textAlign: 'center', fontSize: 11, color: colors.textMuted, marginTop: spacing.md },
});
