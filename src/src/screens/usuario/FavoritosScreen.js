import React from 'react';
import { Text, StyleSheet } from 'react-native';
import UserScreen from '../../components/UserScreen';
import Header from '../../components/Header';
import ServiceCard from '../../components/ServiceCard';
import EmptyState from '../../components/EmptyState';
import { colors, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function FavoritosScreen() {
  const { usuarioActual, favoritosDeUsuario } = useData();
  const { navegar } = useNav();
  const favoritos = usuarioActual ? favoritosDeUsuario(usuarioActual.id) : [];

  return (
    <UserScreen active="Perfil">
      <Header
        kicker="Mi cuenta · Favoritos"
        title="Servicios guardados"
        subtitle="Los talentos que quieres tener a la mano."
        back
      />

      {favoritos.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Todavía no tienes favoritos"
          text="Toca el corazón de cualquier servicio para guardarlo aquí y encontrarlo después."
        />
      ) : (
        <>
          <Text style={styles.count}>
            {favoritos.length} {favoritos.length === 1 ? 'servicio guardado' : 'servicios guardados'}
          </Text>
          {favoritos.map((f) => (
            <ServiceCard
              key={f.id}
              servicio={f.servicio}
              onPress={() => navegar('ServicioDetalle', { id: f.servicio.id })}
            />
          ))}
        </>
      )}
    </UserScreen>
  );
}

const styles = StyleSheet.create({
  count: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm },
});
