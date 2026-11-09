import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Header from '../../components/Header';
import Field from '../../components/Field';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import InfoBox from '../../components/InfoBox';
import { colors, radius, spacing } from '../../theme';
import { useData } from '../../context/DataContext';
import { useNav } from '../../navigation/context';

export default function CreditoFormScreen() {
  const {
    usuarios, usuarioActual, saldoUsuario, transferirCreditos, crearMovimiento,
  } = useData();
  const { volver } = useNav();
  const [destinoId, setDestinoId] = useState('');
  const [monto, setMonto] = useState('1');
  const [concepto, setConcepto] = useState('');
  const [ajuste, setAjuste] = useState(false);

  const saldo = usuarioActual ? saldoUsuario(usuarioActual.id) : 0;
  const otros = usuarios.filter((u) => !usuarioActual || u.id !== usuarioActual.id);

  const enviar = () => {
    if (!destinoId) {
      Alert.alert('Elige un destinatario', 'Selecciona a quién transferirás los créditos.');
      return;
    }
    if (ajuste) {
      crearMovimiento({
        usuarioId: destinoId,
        monto: Number(monto),
        concepto: concepto.trim() || 'Ajuste administrativo de créditos',
      });
      Alert.alert('Ajuste registrado', 'Se agregó el movimiento al historial del miembro.');
      volver();
      return;
    }
    const resultado = transferirCreditos(destinoId, Number(monto), concepto.trim());
    if (!resultado.ok) {
      Alert.alert('No se pudo transferir', resultado.error);
      return;
    }
    Alert.alert('Transferencia realizada', `Enviaste ${monto} créditos correctamente.`);
    volver();
  };

  return (
    <Screen>
      <Header
        kicker="Mi cuenta · Créditos"
        title="Transferir créditos"
        subtitle="Comparte tu tiempo disponible con otro miembro."
        back
      />

      <View style={styles.saldo}>
        <Ionicons name="time-outline" size={22} color={colors.primary} />
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text style={styles.saldoLabel}>Tu saldo disponible</Text>
          <Text style={styles.saldoValue}>{saldo} créditos</Text>
        </View>
        <Pressable onPress={() => setAjuste((v) => !v)} style={styles.ajusteBtn}>
          <Ionicons name={ajuste ? 'toggle' : 'toggle-outline'} size={24} color={colors.admin} />
        </Pressable>
      </View>

      {ajuste ? (
        <InfoBox
          tone="warning"
          title="Modo administrador"
          text="Como administrador puedes registrar un ajuste manual (positivo o negativo) sin descontar de tu saldo."
        />
      ) : null}

      <Text style={styles.label}>Destinatario *</Text>
      {otros.map((u) => {
        const activo = destinoId === u.id;
        return (
          <Pressable
            key={u.id}
            onPress={() => setDestinoId(u.id)}
            style={[styles.persona, activo && styles.personaActive]}
          >
            <Avatar initials={u.iniciales} size={40} />
            <View style={{ flex: 1, marginLeft: spacing.sm + 4 }}>
              <Text style={styles.personaNombre}>{u.nombre}</Text>
              <Text style={styles.personaSub}>{u.rol} · {saldoUsuario(u.id)} créditos</Text>
            </View>
            <Ionicons
              name={activo ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={activo ? colors.primary : colors.textMuted}
            />
          </Pressable>
        );
      })}

      <Field
        label="Monto en créditos *"
        value={monto}
        onChangeText={setMonto}
        keyboardType="decimal-pad"
        icon="timer-outline"
        hint="1 crédito equivale a 1 hora de servicio."
      />

      <Field
        label="Concepto"
        value={concepto}
        onChangeText={setConcepto}
        placeholder="Ej. Pago por clase de guitarra"
      />

      <InfoBox
        text="La transferencia mueve el saldo de inmediato y queda registrada en el historial de ambas personas."
      />

      <Button label="Confirmar transferencia" icon="checkmark-circle-outline" onPress={enviar} />
      <Button label="Cancelar" variant="outline" onPress={volver} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  saldo: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primarySoft,
    borderRadius: radius.md, padding: spacing.md,
  },
  saldoLabel: { fontSize: 11, color: colors.textMuted },
  saldoValue: { fontSize: 18, fontWeight: '800', color: colors.primary },
  ajusteBtn: { padding: 4 },
  label: { fontSize: 11, color: colors.textMuted, marginTop: spacing.md, marginBottom: spacing.xs },
  persona: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.sm + 4, marginBottom: spacing.sm,
  },
  personaActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  personaNombre: { fontSize: 13, fontWeight: '700', color: colors.text },
  personaSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
});
