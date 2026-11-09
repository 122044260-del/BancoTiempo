import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Header from '../../components/Header';
import Button from '../../components/Button';
import InfoBox from '../../components/InfoBox';
import EmptyState from '../../components/EmptyState';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function SolicitudFormScreen({ servicioId: servicioInicial }) {
  const {
    servicios, servicioPorId, usuarioPorId, usuarioActual, crearSolicitud, actualizarSolicitud,
  } = useData();
  const { navegar, volver, reemplazar } = useNav();
  const [servicioId, setServicioId] = useState(servicioInicial || '');
  const [mensaje, setMensaje] = useState('');
  const [buscar, setBuscar] = useState('');

  const disponibles = servicios.filter(
    (s) =>
      s.estado === 'Activo' &&
      (!usuarioActual || s.usuarioId !== usuarioActual.id) &&
      (!buscar.trim() || s.titulo.toLowerCase().includes(buscar.trim().toLowerCase()))
  );

  const servicio = servicioId ? servicioPorId(servicioId) : null;
  const proveedor = servicio ? usuarioPorId(servicio.usuarioId) : null;

  const enviar = () => {
    if (!usuarioActual) {
      Alert.alert('Inicia sesión', 'Necesitas una cuenta para enviar solicitudes.');
      return;
    }
    if (!servicioId) {
      Alert.alert('Elige un servicio', 'Selecciona el servicio que quieres solicitar.');
      return;
    }
    if (mensaje.trim().length < 10) {
      Alert.alert('Mensaje muy corto', 'Escribe al menos 10 caracteres para presentarte.');
      return;
    }
    const nueva = crearSolicitud({ servicioId, mensaje: mensaje.trim() });
    if (!nueva) {
      Alert.alert('No se pudo enviar', 'Intenta de nuevo con otro servicio.');
      return;
    }
    Alert.alert('Solicitud enviada', `${proveedor ? proveedor.nombre : 'El proveedor'} recibirá tu solicitud.`);
    reemplazar('SolicitudDetalle', { id: nueva.id });
  };

  return (
    <Screen>
      <Header
        kicker="Intercambios · Solicitudes"
        title="Nueva solicitud"
        subtitle="Elige un servicio y cuéntale al proveedor qué necesitas."
        back
      />

      {!servicioInicial ? (
        <>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              value={buscar}
              onChangeText={setBuscar}
              placeholder="Buscar servicios disponibles"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {disponibles.length === 0 ? (
            <EmptyState icon="search-outline" title="Sin servicios" text="No hay servicios que coincidan con tu búsqueda." />
          ) : (
            disponibles.map((s) => {
              const autor = usuarioPorId(s.usuarioId);
              const activo = servicioId === s.id;
              return (
                <Pressable
                  key={s.id}
                  onPress={() => setServicioId(s.id)}
                  style={[styles.option, activo && styles.optionActive]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionTitle, activo && { color: colors.primary }]}>{s.titulo}</Text>
                    <Text style={styles.optionSub}>{autor ? autor.nombre : 'Miembro'} · {s.horas} h · {s.modalidad}</Text>
                  </View>
                  <Ionicons
                    name={activo ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={activo ? colors.primary : colors.textMuted}
                  />
                </Pressable>
              );
            })
          )}
        </>
      ) : null}

      {servicio ? (
        <View style={styles.resumen}>
          <Text style={styles.resumenLabel}>Servicio seleccionado</Text>
          <Text style={styles.resumenTitle}>{servicio.titulo}</Text>
          <Text style={styles.resumenSub}>
            {proveedor ? proveedor.nombre : 'Proveedor'} · {servicio.horas} h · {servicio.modalidad}
          </Text>
          <Text style={styles.resumenCosto}>Costo: {servicio.horas} créditos de tiempo</Text>
        </View>
      ) : null}

      <Text style={styles.label}>Mensaje para el proveedor *</Text>
      <View style={styles.areaBox}>
        <TextInput
          style={styles.area}
          value={mensaje}
          onChangeText={setMensaje}
          multiline
          placeholder="Hola, me interesa tu servicio porque..."
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <InfoBox
        text="Al aceptar la solicitud se crea un intercambio. Los créditos se mueven cuando ambas personas confirman que la sesión se realizó."
      />

      <Button label="Enviar solicitud" icon="paper-plane-outline" onPress={enviar} />
      <Button label="Cancelar" variant="outline" onPress={volver} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, marginBottom: spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, paddingVertical: 11, marginLeft: spacing.sm },
  option: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  optionActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optionTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  optionSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  resumen: { backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  resumenLabel: { fontSize: 10, fontWeight: '700', color: colors.primary, textTransform: 'uppercase' },
  resumenTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 2 },
  resumenSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  resumenCosto: { fontSize: 12, fontWeight: '700', color: colors.primary, marginTop: spacing.sm },
  label: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.xs, marginTop: spacing.md },
  areaBox: {
    backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1,
    borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: 10,
  },
  area: { minHeight: 96, fontSize: 14, color: colors.text, textAlignVertical: 'top' },
});
