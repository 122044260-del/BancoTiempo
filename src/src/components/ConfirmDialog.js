import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';
import Button from './Button';

export default function ConfirmDialog({
  visible,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmLabel = 'Eliminar',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.fondo}>
        <View style={styles.caja}>
          <Text style={styles.titulo}>{title}</Text>
          <Text style={styles.mensaje}>{message}</Text>
          <Button label={confirmLabel} variant="danger" onPress={onConfirm} />
          <Button label="Cancelar" variant="outline" onPress={onCancel} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  caja: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  titulo: { fontSize: 18, fontWeight: '800', color: colors.text },
  mensaje: { fontSize: 13, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 19 },
});
