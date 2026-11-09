import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserScreen from '../../components/UserScreen';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import Chip from '../../components/Chip';
import ServiceCard from '../../components/ServiceCard';
import EmptyState from '../../components/EmptyState';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

const modalidades = ['Todas', 'En línea', 'Presencial', 'Híbrido'];

export default function ExplorarScreen() {
  const { servicios, categorias, habilidadPorId } = useData();
  const { navegar } = useNav();
  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [modalidad, setModalidad] = useState('Todas');

  const filtrados = useMemo(() => {
    const q = texto.trim().toLowerCase();
    return servicios.filter((s) => {
      const coincideTexto =
        !q || s.titulo.toLowerCase().includes(q) || (s.descripcion || '').toLowerCase().includes(q);
      const coincideModalidad = modalidad === 'Todas' || s.modalidad === modalidad;
      const habilidad = habilidadPorId(s.habilidadId);
      const coincideCategoria =
        categoria === 'Todas' || (habilidad && habilidad.categoriaId === categoria);
      return coincideTexto && coincideModalidad && coincideCategoria && s.estado !== 'Pausado';
    });
  }, [servicios, texto, modalidad, categoria, habilidadPorId]);

  return (
    <UserScreen active="Explorar">
      <Header
        kicker="Comunidad · Catálogo"
        title="Explorar talentos"
        subtitle="Encuentra a alguien que te enseñe o te ayude."
      />

      <SearchBar value={texto} onChangeText={setTexto} placeholder="Buscar un servicio o habilidad" />

      <Text style={styles.label}>Categorías</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.xs }}>
        <Chip label="Todas" active={categoria === 'Todas'} onPress={() => setCategoria('Todas')} />
        {categorias.map((c) => (
          <Chip key={c.id} label={c.nombre} active={categoria === c.id} onPress={() => setCategoria(c.id)} />
        ))}
      </ScrollView>

      <Text style={styles.label}>Modalidad</Text>
      <View style={styles.rowWrap}>
        {modalidades.map((m) => (
          <Chip key={m} label={m} active={modalidad === m} onPress={() => setModalidad(m)} />
        ))}
      </View>

      <Pressable style={styles.publish} onPress={() => navegar('ServicioForm')}>
        <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text style={styles.publishTitle}>Publica un servicio</Text>
          <Text style={styles.publishSub}>Comparte una habilidad y gana créditos.</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Pressable>

      <Text style={styles.count}>
        {filtrados.length} {filtrados.length === 1 ? 'servicio disponible' : 'servicios disponibles'}
      </Text>

      {filtrados.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="Sin coincidencias"
          text="Prueba con otra palabra o cambia los filtros de categoría y modalidad."
        />
      ) : (
        filtrados.map((s) => (
          <ServiceCard key={s.id} servicio={s} onPress={() => navegar('ServicioDetalle', { id: s.id })} />
        ))
      )}
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  publish: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primarySoft,
    borderRadius: radius.md, padding: spacing.md, marginTop: spacing.sm, marginBottom: spacing.md,
  },
  publishTitle: { fontSize: 14, fontWeight: '700', color: colors.primary },
  publishSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  count: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm },
});
