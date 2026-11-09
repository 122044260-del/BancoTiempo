import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DataProvider } from './src/src/context/DataContext';
import NavigationProvider from './src/src/navigation/NavigationProvider';
import { screens } from './src/src/navigation/screens';

// Proyecto · Banco de Tiempo y Talento
// App con navegación propia por pila: acceso, usuario general y administración.
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <DataProvider>
        <NavigationProvider screens={screens} initial="Bienvenida" />
      </DataProvider>
    </SafeAreaProvider>
  );
}
