// Datos iniciales de la app. Se usan para que las pantallas tengan información
// realista mientras el usuario crea, edita o elimina registros.

export const usuarios = [
  {
    id: 'u1', iniciales: 'AM', nombre: 'Ana Martínez', correo: 'ana.martinez@correo.mx',
    telefono: '55 2468 1837', contrasena: '12345678', rol: 'Usuario general',
    estado: 'Activo', ubicacion: 'Centro, Querétaro', fechaRegistro: '2026-10-01',
    bio: 'Diseñadora gráfica y fotógrafa aficionada. Me encanta enseñar lo que sé.',
  },
  {
    id: 'u2', iniciales: 'CM', nombre: 'Carlos Mendoza', correo: 'carlos.mendoza@correo.mx',
    telefono: '55 1357 9024', contrasena: '12345678', rol: 'Usuario general',
    estado: 'Activo', ubicacion: 'Juriquilla, Querétaro', fechaRegistro: '2026-09-18',
    bio: 'Músico y profesor de guitarra. Doy clases para todos los niveles.',
  },
  {
    id: 'u3', iniciales: 'DR', nombre: 'Diego Ramírez', correo: 'diego.ramirez@correo.mx',
    telefono: '55 9081 3355', contrasena: '12345678', rol: 'Usuario general',
    estado: 'Activo', ubicacion: 'Santa María, Querétaro', fechaRegistro: '2026-09-12',
    bio: 'Ingeniero en sistemas. Reparo laptops y doy asesorías de inglés.',
  },
  {
    id: 'u4', iniciales: 'LH', nombre: 'Lucía Hernández', correo: 'lucia.hernandez@correo.mx',
    telefono: '55 7712 4400', contrasena: '12345678', rol: 'Administrador',
    estado: 'Activo', ubicacion: 'Centro, Querétaro', fechaRegistro: '2026-08-30',
    bio: 'Administradora de la comunidad e instructora de yoga.',
  },
  {
    id: 'u5', iniciales: 'PS', nombre: 'Paola Sánchez', correo: 'paola.sanchez@correo.mx',
    telefono: '55 6611 2098', contrasena: '12345678', rol: 'Usuario general',
    estado: 'Suspendido', ubicacion: 'El Marqués, Querétaro', fechaRegistro: '2026-09-05',
    bio: 'Cocinera. Comparto recetas saludables y técnicas básicas.',
  },
  {
    id: 'u6', iniciales: 'SR', nombre: 'Sofía Ríos', correo: 'sofia.rios@correo.mx',
    telefono: '55 4433 8877', contrasena: '12345678', rol: 'Usuario general',
    estado: 'Activo', ubicacion: 'Corregidora, Querétaro', fechaRegistro: '2026-10-10',
    bio: 'Jardinera y amante de las plantas. Enseño a cuidar espacios verdes.',
  },
];

export const categorias = [
  { id: 'cat1', nombre: 'Educación', icono: 'school-outline', descripcion: 'Clases, asesorías y acompañamiento académico.', activa: true },
  { id: 'cat2', nombre: 'Hogar', icono: 'home-outline', descripcion: 'Reparaciones, jardinería y apoyo en casa.', activa: true },
  { id: 'cat3', nombre: 'Tecnología', icono: 'laptop-outline', descripcion: 'Soporte técnico, diseño digital y programación.', activa: true },
  { id: 'cat4', nombre: 'Arte y creatividad', icono: 'color-palette-outline', descripcion: 'Música, fotografía, diseño y manualidades.', activa: true },
  { id: 'cat5', nombre: 'Cuidado y salud', icono: 'heart-outline', descripcion: 'Bienestar físico, yoga y acompañamiento.', activa: true },
  { id: 'cat6', nombre: 'Cocina', icono: 'restaurant-outline', descripcion: 'Recetas, técnicas y alimentación saludable.', activa: false },
];

export const habilidades = [
  { id: 'h1', nombre: 'Guitarra', categoriaId: 'cat4', nivel: 'Avanzado', descripcion: 'Acordes, ritmo y repertorio para principiantes.' },
  { id: 'h2', nombre: 'Inglés conversacional', categoriaId: 'cat1', nivel: 'Avanzado', descripcion: 'Práctica de fluidez y pronunciación.' },
  { id: 'h3', nombre: 'Reparación de laptops', categoriaId: 'cat3', nivel: 'Intermedio', descripcion: 'Diagnóstico y mantenimiento de equipos.' },
  { id: 'h4', nombre: 'Diseño de identidad', categoriaId: 'cat4', nivel: 'Avanzado', descripcion: 'Logos, paletas y aplicaciones básicas.' },
  { id: 'h5', nombre: 'Jardinería', categoriaId: 'cat2', nivel: 'Intermedio', descripcion: 'Cuidado de plantas y huertos urbanos.' },
  { id: 'h6', nombre: 'Cocina saludable', categoriaId: 'cat6', nivel: 'Intermedio', descripcion: 'Recetas sencillas con ingredientes locales.' },
  { id: 'h7', nombre: 'Yoga', categoriaId: 'cat5', nivel: 'Avanzado', descripcion: 'Posturas, respiración y relajación.' },
  { id: 'h8', nombre: 'Fotografía de retrato', categoriaId: 'cat4', nivel: 'Intermedio', descripcion: 'Luz natural, encuadre y edición básica.' },
];

export const servicios = [
  { id: 's1', titulo: 'Clases de guitarra', habilidadId: 'h1', usuarioId: 'u2', horas: 2, modalidad: 'En línea', estado: 'Activo', fecha: '2026-10-22', descripcion: 'Aprende acordes básicos y toca tu primera canción en dos sesiones.' },
  { id: 's2', titulo: 'Conversación en inglés', habilidadId: 'h2', usuarioId: 'u3', horas: 1, modalidad: 'En línea', estado: 'Activo', fecha: '2026-10-24', descripcion: 'Práctica de conversación enfocada en fluidez y pronunciación.' },
  { id: 's3', titulo: 'Reparación de laptop', habilidadId: 'h3', usuarioId: 'u3', horas: 1.5, modalidad: 'Presencial', estado: 'Activo', fecha: '2026-10-26', descripcion: 'Diagnóstico, limpieza y mantenimiento básico de tu equipo.' },
  { id: 's4', titulo: 'Diseño de logo', habilidadId: 'h4', usuarioId: 'u1', horas: 2, modalidad: 'En línea', estado: 'Activo', fecha: '2026-10-27', descripcion: 'Propuesta de identidad visual sencilla para tu emprendimiento.' },
  { id: 's5', titulo: 'Jardinería básica', habilidadId: 'h5', usuarioId: 'u6', horas: 2, modalidad: 'Presencial', estado: 'Activo', fecha: '2026-10-28', descripcion: 'Prepara tu huerto urbano y aprende a cuidar tus plantas.' },
  { id: 's6', titulo: 'Cocina saludable', habilidadId: 'h6', usuarioId: 'u5', horas: 1.5, modalidad: 'Presencial', estado: 'Pausado', fecha: '2026-10-15', descripcion: 'Tres recetas sencillas con ingredientes de temporada.' },
  { id: 's7', titulo: 'Yoga para principiantes', habilidadId: 'h7', usuarioId: 'u4', horas: 1, modalidad: 'Híbrido', estado: 'Activo', fecha: '2026-10-30', descripcion: 'Rutina suave de posturas, respiración y relajación.' },
  { id: 's8', titulo: 'Fotografía de retrato', habilidadId: 'h8', usuarioId: 'u2', horas: 1.5, modalidad: 'Presencial', estado: 'En revisión', fecha: '2026-11-02', descripcion: 'Sesión de fotos con edición incluida para tu perfil.' },
];

export const solicitudes = [
  { id: 'sol1', servicioId: 's1', solicitanteId: 'u1', proveedorId: 'u2', horas: 2, fecha: '2026-11-06', estado: 'Pendiente', mensaje: 'Hola Carlos, me gustaría empezar con guitarra desde cero.' },
  { id: 'sol2', servicioId: 's3', solicitanteId: 'u1', proveedorId: 'u3', horas: 1.5, fecha: '2026-11-01', estado: 'Aceptada', mensaje: 'Mi laptop está muy lenta, ¿podrías revisarla?' },
  { id: 'sol3', servicioId: 's4', solicitanteId: 'u2', proveedorId: 'u1', horas: 2, fecha: '2026-11-04', estado: 'Pendiente', mensaje: 'Necesito un logo para mi proyecto de música.' },
  { id: 'sol4', servicioId: 's7', solicitanteId: 'u6', proveedorId: 'u4', horas: 1, fecha: '2026-10-29', estado: 'Rechazada', mensaje: '¿Tienes lugar el sábado por la mañana?' },
  { id: 'sol5', servicioId: 's5', solicitanteId: 'u1', proveedorId: 'u6', horas: 2, fecha: '2026-10-25', estado: 'Completada', mensaje: 'Quiero aprender a cuidar las plantas de mi balcón.' },
];

export const intercambios = [
  { id: 'int1', solicitudId: 'sol2', servicioId: 's3', usuarioA: 'u1', usuarioB: 'u3', horas: 1.5, fecha: '2026-11-03', estado: 'En curso', confirmadoA: true, confirmadoB: false },
  { id: 'int2', solicitudId: 'sol5', servicioId: 's5', usuarioA: 'u1', usuarioB: 'u6', horas: 2, fecha: '2026-10-28', estado: 'Completado', confirmadoA: true, confirmadoB: true },
  { id: 'int3', solicitudId: 'sol4', servicioId: 's7', usuarioA: 'u6', usuarioB: 'u4', horas: 1, fecha: '2026-11-01', estado: 'Pendiente', confirmadoA: false, confirmadoB: false },
  { id: 'int4', solicitudId: 'sol1', servicioId: 's2', usuarioA: 'u2', usuarioB: 'u3', horas: 1, fecha: '2026-10-20', estado: 'Completado', confirmadoA: true, confirmadoB: true },
];

export const movimientos = [
  { id: 'm1', usuarioId: 'u1', monto: 5, concepto: 'Créditos de bienvenida', fecha: '2026-10-01' },
  { id: 'm2', usuarioId: 'u2', monto: 5, concepto: 'Créditos de bienvenida', fecha: '2026-09-18' },
  { id: 'm3', usuarioId: 'u3', monto: 5, concepto: 'Créditos de bienvenida', fecha: '2026-09-12' },
  { id: 'm4', usuarioId: 'u4', monto: 5, concepto: 'Créditos de bienvenida', fecha: '2026-08-30' },
  { id: 'm5', usuarioId: 'u5', monto: 5, concepto: 'Créditos de bienvenida', fecha: '2026-09-05' },
  { id: 'm6', usuarioId: 'u6', monto: 5, concepto: 'Créditos de bienvenida', fecha: '2026-10-10' },
  { id: 'm7', usuarioId: 'u1', monto: -2, concepto: 'Pago a Sofía Ríos · Jardinería básica', fecha: '2026-10-28' },
  { id: 'm8', usuarioId: 'u6', monto: 2, concepto: 'Ingreso por Jardinería básica', fecha: '2026-10-28' },
  { id: 'm9', usuarioId: 'u2', monto: -2, concepto: 'Pago a Ana Martínez · Diseño de logo', fecha: '2026-11-04' },
  { id: 'm10', usuarioId: 'u1', monto: 2, concepto: 'Ingreso por Diseño de logo', fecha: '2026-11-04' },
  { id: 'm11', usuarioId: 'u1', monto: -1.5, concepto: 'Pago a Diego Ramírez · Reparación de laptop', fecha: '2026-11-03' },
  { id: 'm12', usuarioId: 'u3', monto: 1.5, concepto: 'Ingreso por Reparación de laptop', fecha: '2026-11-03' },
  { id: 'm13', usuarioId: 'u4', monto: 1, concepto: 'Ingreso por Yoga para principiantes', fecha: '2026-11-01' },
  { id: 'm14', usuarioId: 'u6', monto: -1, concepto: 'Pago a Lucía Hernández · Yoga para principiantes', fecha: '2026-11-01' },
  { id: 'm15', usuarioId: 'u3', monto: 1, concepto: 'Ingreso por Conversación en inglés', fecha: '2026-10-20' },
  { id: 'm16', usuarioId: 'u2', monto: -1, concepto: 'Pago a Diego Ramírez · Conversación en inglés', fecha: '2026-10-20' },
  { id: 'm17', usuarioId: 'u2', monto: 2, concepto: 'Ingreso por Clases de guitarra', fecha: '2026-11-06' },
  { id: 'm18', usuarioId: 'u6', monto: -2, concepto: 'Pago a Carlos Mendoza · Clases de guitarra', fecha: '2026-11-06' },
];

export const calificaciones = [
  { id: 'cal1', servicioId: 's1', emisorId: 'u6', receptorId: 'u2', estrellas: 5, comentario: 'Carlos explica con mucha paciencia y la sesión fue muy divertida.', fecha: '2026-11-07' },
  { id: 'cal2', servicioId: 's3', emisorId: 'u1', receptorId: 'u3', estrellas: 4, comentario: 'Mi laptop quedó como nueva. Tardó un poco, pero valió la pena.', fecha: '2026-11-05' },
  { id: 'cal3', servicioId: 's4', emisorId: 'u2', receptorId: 'u1', estrellas: 5, comentario: 'El logo quedó justo como lo imaginaba. Súper recomendada.', fecha: '2026-11-05' },
  { id: 'cal4', servicioId: 's5', emisorId: 'u1', receptorId: 'u6', estrellas: 5, comentario: 'Sofía me enseñó a rescatar mis plantas. Muy clara y amable.', fecha: '2026-10-29' },
  { id: 'cal5', servicioId: 's7', emisorId: 'u6', receptorId: 'u4', estrellas: 4, comentario: 'La clase de yoga fue relajante y bien guiada.', fecha: '2026-11-02' },
];

export const favoritos = [
  { id: 'fav1', usuarioId: 'u1', servicioId: 's1' },
  { id: 'fav2', usuarioId: 'u1', servicioId: 's7' },
  { id: 'fav3', usuarioId: 'u2', servicioId: 's4' },
];

export const reportes = [
  { id: 'r1', tipo: 'Servicio inapropiado', reportaId: 'u5', reportadoId: 'u2', servicioId: 's1', motivo: 'El servicio no coincide con la descripción publicada.', estado: 'Pendiente', fecha: '2026-11-05' },
  { id: 'r2', tipo: 'Usuario no asistió', reportaId: 'u1', reportadoId: 'u3', servicioId: 's3', motivo: 'No se presentó a la sesión acordada y no avisó.', estado: 'En revisión', fecha: '2026-11-04' },
  { id: 'r3', tipo: 'Mensaje ofensivo', reportaId: 'u6', reportadoId: 'u5', servicioId: null, motivo: 'Lenguaje inapropiado en el chat de la solicitud.', estado: 'Resuelto', fecha: '2026-10-30' },
  { id: 'r4', tipo: 'Spam', reportaId: 'u3', reportadoId: 'u5', servicioId: 's6', motivo: 'Publica el mismo servicio varias veces al día.', estado: 'Pendiente', fecha: '2026-11-02' },
];

export const notificaciones = [
  { id: 'n1', usuarioId: 'u1', titulo: 'Nueva solicitud recibida', texto: 'Carlos quiere tomar tu servicio de Diseño de logo.', leida: false, fecha: '2026-11-04' },
  { id: 'n2', usuarioId: 'u1', titulo: 'Intercambio confirmado', texto: 'Diego confirmó la reparación de laptop.', leida: false, fecha: '2026-11-03' },
  { id: 'n3', usuarioId: 'u1', titulo: 'Calificación recibida', texto: 'Carlos te dio 5 estrellas por Diseño de logo.', leida: true, fecha: '2026-11-05' },
];

export const seed = {
  usuarios, categorias, habilidades, servicios, solicitudes, intercambios,
  movimientos, calificaciones, favoritos, reportes, notificaciones,
};
