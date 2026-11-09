import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../theme';

// Círculo con iniciales (por ejemplo "AM")
export default function Avatar({ initials, size = 44 }) {
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ color: colors.primary, fontWeight: '700', fontSize: size / 3 }}>{initials}</Text>
    </View>
  );
}