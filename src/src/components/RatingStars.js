import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// Muestra estrellas. Si se pasa onChange, permite calificar tocando.
export default function RatingStars({ value = 0, size = 16, onChange, showValue = false }) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((n) => {
        const activa = n <= Math.round(value);
        const estrella = (
          <Ionicons
            name={activa ? 'star' : 'star-outline'}
            size={size}
            color={colors.gold}
            style={{ marginRight: 2 }}
          />
        );
        return onChange ? (
          <Pressable key={n} onPress={() => onChange(n)} hitSlop={6}>
            {estrella}
          </Pressable>
        ) : (
          <View key={n}>{estrella}</View>
        );
      })}
      {showValue ? (
        <Text style={styles.value}>{Number(value).toFixed(1)}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  value: { fontSize: 12, fontWeight: '700', color: colors.text, marginLeft: 4 },
});
