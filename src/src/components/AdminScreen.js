import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import { useNav } from '../navigation/context';

const tabs = [
  { nombre: 'Panel', icono: 'grid-outline', ruta: 'PanelGlobal' },
  { nombre: 'Usuarios', icono: 'people-outline', ruta: 'Usuarios' },
  { nombre: 'Catálogo', icono: 'albums-outline', ruta: 'Categorias' },
  { nombre: 'Reportes', icono: 'bar-chart-outline', ruta: 'Reportes' },
  { nombre: 'Ajustes', icono: 'settings-outline', ruta: 'Ajustes' },
];

// active = nombre de la pestaña resaltada
export default function AdminScreen({ children, active = 'Panel' }) {
  const { navegar, reiniciar } = useNav();

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
              <Ionicons name={t.icono} size={22} color={activa ? colors.admin : colors.textMuted} />
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
  tabTextActive: { color: colors.admin, fontWeight: '700' },
});
