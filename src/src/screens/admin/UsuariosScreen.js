import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminScreen from '../../components/AdminScreen';
import AdminHeader from '../../components/AdminHeader';
import AdminButton from '../../components/AdminButton';
import SearchBar from '../../components/SearchBar';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';
import SegmentedTabs from '../../components/SegmentedTabs';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function UsuariosScreen() {
  const { usuarios, saldoUsuario, promedioUsuario, serviciosDeUsuario } = useData();
  const { navegar } = useNav();
  const [texto, setTexto] = useState('');
  const [vista, setVista] = useState('todos');

  const lista = useMemo(
    () =>
      usuarios.filter((u) => {
        const q = texto.trim().toLowerCase();
        const coincide =
          !q ||
          u.nombre.toLowerCase().includes(q) ||
          u.correo.toLowerCase().includes(q);
        const estado = vista === 'todos' || u.estado === vista;
        return coincide && estado;
      }),
    [usuarios, texto, vista]
  );

  return (
    <AdminScreen active="Usuarios">
      <AdminHeader
        kicker="Administrador · Usuarios"
        title="Gestión de usuarios"
        subtitle={`${usuarios.length} cuentas registradas en la comunidad.`}
      />

      <AdminButton label="Crear nuevo usuario" icon="person-add-outline" onPress={() => navegar('UsuarioForm')} />

      <SearchBar value={texto} onChangeText={setTexto} placeholder="Buscar por nombre o correo" />

      <SegmentedTabs
        tone="admin"
        options={[
          { label: 'Todos', value: 'todos' },
          { label: 'Activos', value: 'Activo' },
          { label: 'Suspendidos', value: 'Suspendido' },
        ]}
        value={vista}
        onChange={setVista}
      />

      <Text style={styles.count}>{lista.length} resultados</Text>

      {lista.length === 0 ? (
        <EmptyState icon="people-outline" title="Sin usuarios" text="No hay cuentas que coincidan con la búsqueda." />
      ) : (
        lista.map((u) => (
          <Pressable
            key={u.id}
            style={styles.card}
            onPress={() => navegar('UsuarioDetalle', { id: u.id })}
          >
            <Avatar initials={u.iniciales} size={44} />
            <View style={{ flex: 1, marginLeft: spacing.sm + 4 }}>
              <View style={styles.nameRow}>
                <Text style={styles.nombre}>{u.nombre}</Text>
                <Badge label={u.estado} tone={u.estado === 'Activo' ? 'success' : 'warning'} />
              </View>
              <Text style={styles.correo}>{u.correo}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>{u.rol}</Text>
                <Text style={styles.meta}>·</Text>
                <Text style={styles.meta}>{saldoUsuario(u.id)} créditos</Text>
                <Text style={styles.meta}>·</Text>
                <Text style={styles.meta}>{serviciosDeUsuario(u.id).length} servicios</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))
      )}

      <AdminButton
        label="Gestionar habilidades"
        variant="outline"
        icon="pricetags-outline"
        onPress={() => navegar('Habilidades')}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  count: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.sm },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nombre: { fontSize: 14, fontWeight: '700', color: colors.text, flex: 1, marginRight: spacing.xs },
  correo: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 3 },
  meta: { fontSize: 10, color: colors.textMuted, marginRight: 4 },
});
