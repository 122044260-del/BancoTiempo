import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserScreen from '../../components/UserScreen';
import Header from '../../components/Header';
import SegmentedTabs from '../../components/SegmentedTabs';
import SearchBar from '../../components/SearchBar';
import ServiceCard from '../../components/ServiceCard';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function ServiciosScreen() {
  const { servicios, usuarioActual, serviciosDeUsuario } = useData();
  const { navegar } = useNav();
  const [vista, setVista] = useState('mis');
  const [texto, setTexto] = useState('');

  const base = vista === 'mis' && usuarioActual ? serviciosDeUsuario(usuarioActual.id) : servicios;
  const lista = useMemo(
    () =>
      base.filter(
        (s) =>
          !texto.trim() ||
          s.titulo.toLowerCase().includes(texto.trim().toLowerCase())
      ),
    [base, texto]
  );

  return (
    <UserScreen active="Perfil">
      <Header
        kicker="Catálogo · Servicios"
        title="Servicios"
        subtitle="Administra lo que ofreces y descubre lo de la comunidad."
        back
      />

      <SegmentedTabs
        options={[
          { label: 'Mis servicios', value: 'mis' },
          { label: 'Todos', value: 'todos' },
        ]}
        value={vista}
        onChange={setVista}
      />

      <SearchBar value={texto} onChangeText={setTexto} placeholder="Buscar por título" />

      <Button
        label="Publicar nuevo servicio"
        icon="add-circle-outline"
        onPress={() => navegar('ServicioForm')}
      />

      <Text style={styles.count}>
        {lista.length} {lista.length === 1 ? 'servicio' : 'servicios'}
      </Text>

      {lista.length === 0 ? (
        <EmptyState
          icon="construct-outline"
          title="Sin servicios"
          text="Publica tu primera habilidad para empezar a intercambiar tiempo."
        />
      ) : (
        lista.map((s) => (
          <ServiceCard
            key={s.id}
            servicio={s}
            mostrarAutor={vista === 'todos'}
            onPress={() => navegar('ServicioDetalle', { id: s.id })}
          />
        ))
      )}

      <Pressable style={styles.linkRow} onPress={() => navegar('Habilidades')}>
        <Ionicons name="pricetags-outline" size={17} color={colors.primary} />
        <Text style={styles.linkText}>Ver catálogo de habilidades</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </Pressable>
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  count: { fontSize: 12, color: colors.textMuted, marginTop: spacing.md, marginBottom: spacing.sm },
  linkRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginTop: spacing.sm,
  },
  linkText: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.text, marginLeft: spacing.sm },
});
