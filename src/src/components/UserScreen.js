import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import { useNav } from '../navigation/context';

const tabs = [
  { nombre: 'Inicio', icono: 'home-outline', ruta: 'Inicio' },
  { nombre: 'Explorar', icono: 'search-outline', ruta: 'Explorar' },
  { nombre: 'Solicitudes', icono: 'mail-outline', ruta: 'Solicitudes' },
  { nombre: 'Créditos', icono: 'timer-outline', ruta: 'Creditos' },
  { nombre: 'Perfil', icono: 'person-outline', ruta: 'MiPerfil' },
];

// Contenedor de las pantallas del usuario general con barra inferior.
export default function UserScreen({ children, active = 'Inicio' }) {
  const { reiniciar } = useNav();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      <View style={styles.tabBar}>
        {tabs.map((t) => {
          const activa = t.nombre === active;
          return (
            <Pressable
              key={t.nombre}
              style={styles.tab}
              onPress={() => (activa ? null : reiniciar(t.ruta))}
              accessibilityRole="button"
            >
              <Ionicons name={t.icono} size={22} color={activa ? colors.primary : colors.textMuted} />
              <Text style={[styles.tabText, activa && styles.tabTextActive]}>{t.nombre}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.lg },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.sm,
  },
  tab: { flex: 1, alignItems: 'center' },
  tabText: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  tabTextActive: { color: colors.primary, fontWeight: '700' },
});
