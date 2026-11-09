# Banco de Tiempo y Talento · Guía de pantallas

Aplicación Expo/React Native con navegación propia (sin librerías externas) y datos
en memoria. Las operaciones CRUD, solicitudes, intercambios, créditos, calificaciones,
favoritos y reportes funcionan realmente dentro de la sesión.

## Cómo ejecutar

```powershell
cd C:\Users\cross\BancoTiempo
npm start          # Expo: abre en Android, iOS o Expo Go
npm run web        # Versión web en el navegador
```

## Cuentas de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Usuario general (Ana Martínez) | ana.martinez@correo.mx | 12345678 |
| Administradora (Lucía Hernández) | lucia.hernandez@correo.mx | 12345678 |

La pantalla de inicio de sesión también tiene botones de **acceso rápido** para
entrar como Ana o como Lucía sin escribir credenciales.

## 34 pantallas incluidas

### Acceso (4)
1. `Bienvenida`
2. `IniciarSesion`
3. `Registro`
4. `Recuperar`

### Usuario general (5)
5. `Inicio` — saldo, reputación, intercambios activos y recomendados
6. `Explorar` — buscador, filtros por categoría y modalidad
7. `MiPerfil` — estadísticas personales y accesos
8. `EditarPerfil` — actualización de datos real
9. `Favoritos` — servicios guardados

### CRUD de usuarios (3)
10. `Usuarios` — lista, búsqueda y filtro por estado
11. `UsuarioForm` — crear y editar
12. `UsuarioDetalle` — ficha, servicios, suspender y eliminar

### CRUD de categorías (3)
13. `Categorias`
14. `CategoriaForm` — incluye selector de ícono
15. `CategoriaDetalle`

### CRUD de habilidades (3)
16. `Habilidades`
17. `HabilidadForm`
18. `HabilidadDetalle`

### CRUD de servicios (3)
19. `Servicios`
20. `ServicioForm`
21. `ServicioDetalle` — favorito, solicitud, edición y borrado

### Solicitudes, intercambios y créditos (7)
22. `Solicitudes` — recibidas, enviadas y todas
23. `SolicitudForm` — relación servicio → solicitud
24. `SolicitudDetalle` — aceptar/rechazar y crear intercambio
25. `Intercambios`
26. `IntercambioDetalle` — doble confirmación y movimiento de créditos
27. `Creditos` — saldo e historial
28. `CreditoForm` — transferencia entre miembros

### Calificaciones y favoritos (2 + pantalla 9)
29. `Calificaciones` — recibidas y enviadas
30. `CalificacionForm` — estrellas y comentario

### Reportes y dashboard (3)
31. `PanelGlobal` — dashboard con métricas y gráfica
32. `Reportes` — embudo de estados y reportes por tipo
33. `ReporteDetalle` — gestión de la incidencia

### Ajustes (1)
34. `Ajustes` — reglas, interruptores y resumen de la comunidad

## Relaciones entre pantallas

- Servicio → Solicitud → Intercambio → Calificación.
- Intercambio completado → movimientos de créditos de ambas personas.
- Usuario ↔ Servicio ↔ Habilidad ↔ Categoría.
- Reporte ↔ Usuario reportado y servicio relacionado.
- Favoritos ↔ Usuario y servicio.

## Nota sobre persistencia

Los datos viven en `src/src/data/seed.js` y se administran con `src/src/context/DataContext.js`.
Al cerrar la app se reinician los datos iniciales. Esto es intencional porque la
actividad pidió interfaces y lógica funcional, sin base de datos.
