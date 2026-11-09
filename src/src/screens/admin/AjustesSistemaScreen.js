import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminScreen from '../../components/AdminScreen';
import AdminHeader from '../../components/AdminHeader';
import AdminButton from '../../components/AdminButton';
import Field from '../../components/Field';
import InfoBox from '../../components/InfoBox';
import SectionTitle from '../../components/SectionTitle';
import MenuRow from '../../components/MenuRow';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

function FilaSwitch({ icono, titulo, descripcion, activo, onChange }) {
  return (
    <View style={styles.fila}>
      <View style={styles.filaIcon}>
        <Ionicons name={icono} size={18} color={colors.admin} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.descripcion}>{descripcion}</Text>
      </View>
      <Switch value={activo} onValueChange={onChange} trackColor={{ true: colors.admin }} />
    </View>
  );
}

export default function AjustesSistemaScreen() {
  const { cerrarSesion, usuarios, servicios, intercambios, reportes } = useData();
  const { reiniciar, navegar } = useNav();

  const [registroAbierto, setRegistroAbierto] = useState(true);
  const [aprobacion, setAprobacion] = useState(false);
  const [notificaciones, setNotificaciones] = useState(true);
  const [reportesAuto, setReportesAuto] = useState(true);
  const [horasMax, setHorasMax] = useState('4');
  const [creditosBienvenida, setCreditosBienvenida] = useState('5');

  const guardar = () => {
    Alert.alert(
      'Ajustes guardados',
      `Registro abierto: ${registroAbierto ? 'sí' : 'no'} · Máx. ${horasMax} h por intercambio · ${creditosBienvenida} créditos de bienvenida.`
    );
  };

  const salir = () => {
    cerrarSesion();
    reiniciar('Bienvenida');
  };

  return (
    <AdminScreen active="Ajustes">
      <AdminHeader
        kicker="Administrador · Ajustes"
        title="Ajustes del sistema"
        subtitle="Reglas generales del Banco de Tiempo y Talento."
      />

      <SectionTitle title="Comunidad" />
      <View style={styles.card}>
        <FilaSwitch
          icono="person-add-outline"
          titulo="Registro abierto"
          descripcion="Permite que nuevas personas creen su cuenta."
          activo={registroAbierto}
          onChange={setRegistroAbierto}
        />
        <View style={styles.divisor} />
        <FilaSwitch
          icono="shield-checkmark-outline"
          titulo="Aprobar servicios nuevos"
          descripcion="Los servicios entran como «En revisión»."
          activo={aprobacion}
          onChange={setAprobacion}
        />
        <View style={styles.divisor} />
        <FilaSwitch
          icono="notifications-outline"
          titulo="Notificaciones por correo"
          descripcion="Avisar sobre solicitudes y reportes."
          activo={notificaciones}
          onChange={setNotificaciones}
        />
        <View style={styles.divisor} />
        <FilaSwitch
          icono="flag-outline"
          titulo="Alertas de reportes"
          descripcion="Avisar de inmediato a la administración."
          activo={reportesAuto}
          onChange={setReportesAuto}
        />
      </View>

      <SectionTitle title="Reglas de intercambio" />
      <Field
        label="Máximo de horas por intercambio"
        value={horasMax}
        onChangeText={setHorasMax}
        keyboardType="decimal-pad"
        icon="timer-outline"
        hint="Límite recomendado para evitar dependencias entre miembros."
      />
      <Field
        label="Créditos de bienvenida"
        value={creditosBienvenida}
        onChangeText={setCreditosBienvenida}
        keyboardType="decimal-pad"
        icon="gift-outline"
        hint="Se abonan automáticamente al crear una cuenta."
      />

      <View style={styles.resumen}>
        <Text style={styles.resumenTitulo}>Resumen de la comunidad</Text>
        <View style={styles.resumenRow}>
          <Text style={styles.resumenLabel}>Usuarios registrados</Text>
          <Text style={styles.resumenValor}>{usuarios.length}</Text>
        </View>
        <View style={styles.resumenRow}>
          <Text style={styles.resumenLabel}>Servicios publicados</Text>
          <Text style={styles.resumenValor}>{servicios.length}</Text>
        </View>
        <View style={styles.resumenRow}>
          <Text style={styles.resumenLabel}>Intercambios registrados</Text>
          <Text style={styles.resumenValor}>{intercambios.length}</Text>
        </View>
        <View style={styles.resumenRow}>
          <Text style={styles.resumenLabel}>Reportes abiertos</Text>
          <Text style={styles.resumenValor}>{reportes.filter((r) => r.estado !== 'Resuelto').length}</Text>
        </View>
      </View>

      <AdminButton label="Guardar ajustes" icon="save-outline" onPress={guardar} />

      <SectionTitle title="Administración" />
      <MenuRow
        icon="people-outline"
        title="Gestionar usuarios"
        subtitle="Crear, editar y suspender cuentas"
        tone="admin"
        onPress={() => navegar('Usuarios')}
      />
      <MenuRow
        icon="albums-outline"
        title="Catálogo"
        subtitle="Categorías y habilidades"
        tone="admin"
        onPress={() => navegar('Categorias')}
      />
      <MenuRow
        icon="bar-chart-outline"
        title="Reportes"
        subtitle="Incidencias de la comunidad"
        tone="admin"
        onPress={() => navegar('Reportes')}
      />

      <InfoBox
        text="Esta demostración guarda los cambios en memoria mientras la app está abierta. Al reiniciar se recuperan los datos iniciales."
      />

      <AdminButton label="Cerrar sesión" variant="danger" icon="log-out-outline" onPress={salir} />

      <Text style={styles.version}>Banco de Tiempo y Talento · Versión 1.0.0</Text>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, paddingHorizontal: spacing.md,
  },
  fila: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm + 2 },
  filaIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: colors.adminSoft,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm + 4,
  },
  titulo: { fontSize: 13, fontWeight: '700', color: colors.text },
  descripcion: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  divisor: { height: 1, backgroundColor: colors.border },
  resumen: {
    backgroundColor: colors.adminSoft, borderRadius: radius.md, padding: spacing.md,
    marginTop: spacing.md,
  },
  resumenTitulo: { fontSize: 12, fontWeight: '800', color: colors.admin, marginBottom: spacing.sm },
  resumenRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  resumenLabel: { fontSize: 11, color: colors.text },
  resumenValor: { fontSize: 11, fontWeight: '800', color: colors.admin },
  version: { textAlign: 'center', fontSize: 10, color: colors.textMuted, marginTop: spacing.md },
});
