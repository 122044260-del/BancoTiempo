import React, { useCallback, useState } from 'react';
import { NavigationContext } from './context';

// Navegador basado en una pila de rutas. Cada entrada tiene { name, params }.
export default function NavigationProvider({ screens, initial = 'Bienvenida' }) {
  const [pila, setPila] = useState([{ name: initial, params: {} }]);

  const navegar = useCallback(
    (name, params = {}) => setPila((p) => [...p, { name, params }]),
    []
  );

  const volver = useCallback(
    () => setPila((p) => (p.length > 1 ? p.slice(0, -1) : p)),
    []
  );

  const reemplazar = useCallback(
    (name, params = {}) => setPila((p) => [...p.slice(0, -1), { name, params }]),
    []
  );

  const reiniciar = useCallback(
    (name, params = {}) => setPila([{ name, params }]),
    []
  );

  const actual = pila[pila.length - 1];
  const Pantalla = screens[actual.name] || screens[initial];

  const value = {
    navegar,
    volver,
    reemplazar,
    reiniciar,
    ruta: actual,
    pila,
  };

  return (
    <NavigationContext.Provider value={value}>
      <Pantalla {...actual.params} />
    </NavigationContext.Provider>
  );
}
