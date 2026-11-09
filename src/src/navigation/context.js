import { createContext, useContext } from 'react';

// Contexto de navegación propio (sin librerías externas).
// Las pantallas usan useNav() para moverse entre sí.
export const NavigationContext = createContext({
  navegar: () => {},
  volver: () => {},
  reiniciar: () => {},
  reemplazar: () => {},
  ruta: { name: 'Bienvenida', params: {} },
  pila: [],
});

export const useNav = () => useContext(NavigationContext);
