// Estado global de la app: datos, sesión y operaciones CRUD.
import React, { createContext, useContext, useState } from 'react';
import { seed } from '../data/seed';

const DataContext = createContext(null);

export const useData = () => useContext(DataContext);

const hoy = () => new Date().toISOString().slice(0, 10);
const nuevoId = (prefijo) =>
  `${prefijo}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;

const inicialesDe = (nombre = '') =>
  nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');

export function DataProvider({ children }) {
  const [db, setDb] = useState({ ...seed });
  const [sesionId, setSesionId] = useState(null);

  /* ---------- Operaciones genéricas ---------- */
  const crear = (clave, datos, prefijo) => {
    const nuevo = { id: nuevoId(prefijo || clave), ...datos };
    setDb((d) => ({ ...d, [clave]: [nuevo, ...d[clave]] }));
    return nuevo;
  };

  const actualizar = (clave, id, cambios) =>
    setDb((d) => ({
      ...d,
      [clave]: d[clave].map((item) => (item.id === id ? { ...item, ...cambios } : item)),
    }));

  const eliminar = (clave, id) =>
    setDb((d) => ({ ...d, [clave]: d[clave].filter((item) => item.id !== id) }));

  /* ---------- Sesión ---------- */
  const usuarioActual = sesionId
    ? db.usuarios.find((u) => u.id === sesionId) || null
    : null;

  const iniciarSesion = (correo, contrasena) => {
    const usuario = db.usuarios.find(
      (u) => u.correo.toLowerCase() === (correo || '').trim().toLowerCase()
    );
    if (!usuario || usuario.contrasena !== contrasena) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' };
    }
    if (usuario.estado !== 'Activo') {
      return { ok: false, error: 'Tu cuenta está suspendida. Contacta al administrador.' };
    }
    setSesionId(usuario.id);
    return { ok: true, usuario };
  };

  const iniciarSesionComo = (id) => {
    const usuario = db.usuarios.find((u) => u.id === id);
    if (usuario) setSesionId(usuario.id);
    return usuario || null;
  };

  const registrarse = (datos) => {
    const existe = db.usuarios.some(
      (u) => u.correo.toLowerCase() === (datos.correo || '').trim().toLowerCase()
    );
    if (existe) return { ok: false, error: 'Ya existe una cuenta con ese correo.' };

    const id = nuevoId('u');
    const usuario = {
      id,
      iniciales: inicialesDe(datos.nombre) || 'US',
      rol: 'Usuario general',
      estado: 'Activo',
      fechaRegistro: hoy(),
      bio: 'Miembro nuevo de la comunidad.',
      ...datos,
    };
    const bienvenida = {
      id: nuevoId('m'),
      usuarioId: id,
      monto: 5,
      concepto: 'Créditos de bienvenida',
      fecha: hoy(),
    };
    setDb((d) => ({
      ...d,
      usuarios: [usuario, ...d.usuarios],
      movimientos: [bienvenida, ...d.movimientos],
    }));
    setSesionId(id);
    return { ok: true, usuario };
  };

  const cerrarSesion = () => setSesionId(null);

  const actualizarPerfil = (cambios) => {
    if (!usuarioActual) return;
    actualizar('usuarios', usuarioActual.id, {
      ...cambios,
      iniciales: inicialesDe(cambios.nombre || usuarioActual.nombre),
    });
  };

  /* ---------- Consultas / selectores ---------- */
  const usuarioPorId = (id) => db.usuarios.find((u) => u.id === id);
  const categoriaPorId = (id) => db.categorias.find((c) => c.id === id);
  const habilidadPorId = (id) => db.habilidades.find((h) => h.id === id);
  const servicioPorId = (id) => db.servicios.find((s) => s.id === id);
  const solicitudPorId = (id) => db.solicitudes.find((s) => s.id === id);
  const intercambioPorId = (id) => db.intercambios.find((i) => i.id === id);
  const reportePorId = (id) => db.reportes.find((r) => r.id === id);

  const categoriaDeHabilidad = (habilidadId) => {
    const h = habilidadPorId(habilidadId);
    return h ? categoriaPorId(h.categoriaId) : null;
  };

  const habilidadDeServicio = (servicio) =>
    servicio ? habilidadPorId(servicio.habilidadId) : null;

  const categoriaDeServicio = (servicio) =>
    servicio ? categoriaDeHabilidad(servicio.habilidadId) : null;

  const saldoUsuario = (usuarioId) =>
    db.movimientos
      .filter((m) => m.usuarioId === usuarioId)
      .reduce((total, m) => total + Number(m.monto), 0);

  const movimientosDeUsuario = (usuarioId) =>
    db.movimientos.filter((m) => m.usuarioId === usuarioId);

  const calificacionesDeUsuario = (usuarioId) =>
    db.calificaciones.filter((c) => c.receptorId === usuarioId);

  const calificacionesEnviadas = (usuarioId) =>
    db.calificaciones.filter((c) => c.emisorId === usuarioId);

  const promedioUsuario = (usuarioId) => {
    const lista = calificacionesDeUsuario(usuarioId);
    if (!lista.length) return 0;
    return lista.reduce((t, c) => t + c.estrellas, 0) / lista.length;
  };

  const serviciosDeUsuario = (usuarioId) =>
    db.servicios.filter((s) => s.usuarioId === usuarioId);

  const solicitudesDeUsuario = (usuarioId) =>
    db.solicitudes.filter(
      (s) => s.solicitanteId === usuarioId || s.proveedorId === usuarioId
    );

  const intercambiosDeUsuario = (usuarioId) =>
    db.intercambios.filter(
      (i) => i.usuarioA === usuarioId || i.usuarioB === usuarioId
    );

  const favoritosDeUsuario = (usuarioId) =>
    db.favoritos
      .filter((f) => f.usuarioId === usuarioId)
      .map((f) => ({ ...f, servicio: servicioPorId(f.servicioId) }))
      .filter((f) => f.servicio);

  const esFavorito = (servicioId) =>
    !!usuarioActual &&
    db.favoritos.some(
      (f) => f.usuarioId === usuarioActual.id && f.servicioId === servicioId
    );

  const habilidadesDeCategoria = (categoriaId) =>
    db.habilidades.filter((h) => h.categoriaId === categoriaId);

  const serviciosDeCategoria = (categoriaId) =>
    db.servicios.filter((s) => {
      const h = habilidadPorId(s.habilidadId);
      return h && h.categoriaId === categoriaId;
    });

  const notificacionesDeUsuario = (usuarioId) =>
    db.notificaciones.filter((n) => n.usuarioId === usuarioId);

  /* ---------- Usuarios ---------- */
  const crearUsuario = (datos) =>
    crear(
      'usuarios',
      {
        iniciales: inicialesDe(datos.nombre),
        contrasena: '12345678',
        rol: 'Usuario general',
        estado: 'Activo',
        fechaRegistro: hoy(),
        bio: 'Miembro de la comunidad.',
        ...datos,
      },
      'u'
    );

  const actualizarUsuario = (id, cambios) =>
    actualizar('usuarios', id, {
      ...cambios,
      ...(cambios.nombre ? { iniciales: inicialesDe(cambios.nombre) } : {}),
    });

  const eliminarUsuario = (id) => eliminar('usuarios', id);

  /* ---------- Catálogos ---------- */
  const crearCategoria = (datos) => crear('categorias', { activa: true, ...datos }, 'cat');
  const actualizarCategoria = (id, cambios) => actualizar('categorias', id, cambios);
  const eliminarCategoria = (id) => eliminar('categorias', id);

  const crearHabilidad = (datos) => crear('habilidades', datos, 'h');
  const actualizarHabilidad = (id, cambios) => actualizar('habilidades', id, cambios);
  const eliminarHabilidad = (id) => eliminar('habilidades', id);

  /* ---------- Servicios ---------- */
  const crearServicio = (datos) =>
    crear(
      'servicios',
      {
        usuarioId: usuarioActual ? usuarioActual.id : 'u1',
        estado: 'Activo',
        fecha: hoy(),
        ...datos,
      },
      's'
    );

  const actualizarServicio = (id, cambios) => actualizar('servicios', id, cambios);
  const eliminarServicio = (id) => eliminar('servicios', id);

  /* ---------- Solicitudes e intercambios ---------- */
  const crearSolicitud = ({ servicioId, mensaje }) => {
    const servicio = servicioPorId(servicioId);
    if (!servicio || !usuarioActual) return null;
    return crear(
      'solicitudes',
      {
        servicioId,
        solicitanteId: usuarioActual.id,
        proveedorId: servicio.usuarioId,
        horas: servicio.horas,
        fecha: hoy(),
        estado: 'Pendiente',
        mensaje,
      },
      'sol'
    );
  };

  const actualizarSolicitud = (id, cambios) => actualizar('solicitudes', id, cambios);
  const eliminarSolicitud = (id) => eliminar('solicitudes', id);

  const aceptarSolicitud = (id) => {
    const solicitud = solicitudPorId(id);
    if (!solicitud) return null;
    const intercambio = {
      id: nuevoId('int'),
      solicitudId: id,
      servicioId: solicitud.servicioId,
      usuarioA: solicitud.solicitanteId,
      usuarioB: solicitud.proveedorId,
      horas: solicitud.horas,
      fecha: hoy(),
      estado: 'Pendiente',
      confirmadoA: false,
      confirmadoB: false,
    };
    setDb((d) => ({
      ...d,
      solicitudes: d.solicitudes.map((s) =>
        s.id === id ? { ...s, estado: 'Aceptada' } : s
      ),
      intercambios: [intercambio, ...d.intercambios],
    }));
    return intercambio;
  };

  const rechazarSolicitud = (id) => actualizarSolicitud(id, { estado: 'Rechazada' });

  const confirmarIntercambio = (id) => {
    const intercambio = intercambioPorId(id);
    if (!intercambio || !usuarioActual) return;
    const soyA = intercambio.usuarioA === usuarioActual.id;
    const confirmadoA = soyA ? true : intercambio.confirmadoA;
    const confirmadoB = soyA ? intercambio.confirmadoB : true;
    actualizarIntercambio(id, {
      confirmadoA,
      confirmadoB,
      estado:
        confirmadoA && confirmadoB && intercambio.estado === 'Pendiente'
          ? 'En curso'
          : intercambio.estado,
    });
  };

  const completarIntercambio = (id) => {
    const intercambio = intercambioPorId(id);
    if (!intercambio || intercambio.estado === 'Completado') return;
    const servicio = servicioPorId(intercambio.servicioId);
    const nombreB = usuarioPorId(intercambio.usuarioB)?.nombre || 'la comunidad';
    const titulo = servicio ? servicio.titulo : 'un servicio';

    const pagos = [
      {
        id: nuevoId('m'),
        usuarioId: intercambio.usuarioA,
        monto: -intercambio.horas,
        concepto: `Pago a ${nombreB} · ${titulo}`,
        fecha: hoy(),
      },
      {
        id: nuevoId('m'),
        usuarioId: intercambio.usuarioB,
        monto: intercambio.horas,
        concepto: `Ingreso por ${titulo}`,
        fecha: hoy(),
      },
    ];

    setDb((d) => ({
      ...d,
      intercambios: d.intercambios.map((i) =>
        i.id === id ? { ...i, estado: 'Completado' } : i
      ),
      solicitudes: d.solicitudes.map((s) =>
        s.id === intercambio.solicitudId ? { ...s, estado: 'Completada' } : s
      ),
      movimientos: [...pagos, ...d.movimientos],
    }));
  };

  const actualizarIntercambio = (id, cambios) => actualizar('intercambios', id, cambios);

  /* ---------- Créditos ---------- */
  const crearMovimiento = (datos) => crear('movimientos', { fecha: hoy(), ...datos }, 'm');

  const transferirCreditos = (destinoId, monto, concepto) => {
    if (!usuarioActual) return { ok: false, error: 'Inicia sesión para transferir.' };
    const cantidad = Number(monto);
    if (!destinoId || !cantidad || cantidad <= 0) {
      return { ok: false, error: 'Escribe un monto mayor a cero.' };
    }
    if (saldoUsuario(usuarioActual.id) < cantidad) {
      return { ok: false, error: 'No tienes créditos suficientes.' };
    }
    const salida = {
      id: nuevoId('m'),
      usuarioId: usuarioActual.id,
      monto: -cantidad,
      concepto: concepto || `Transferencia a ${usuarioPorId(destinoId)?.nombre || 'otro miembro'}`,
      fecha: hoy(),
    };
    const entrada = {
      id: nuevoId('m'),
      usuarioId: destinoId,
      monto: cantidad,
      concepto: `Transferencia de ${usuarioActual.nombre}`,
      fecha: hoy(),
    };
    setDb((d) => ({ ...d, movimientos: [salida, entrada, ...d.movimientos] }));
    return { ok: true };
  };

  /* ---------- Calificaciones y favoritos ---------- */
  const crearCalificacion = (datos) => {
    const calificacion = crear(
      'calificaciones',
      {
        emisorId: usuarioActual ? usuarioActual.id : 'u1',
        fecha: hoy(),
        ...datos,
      },
      'cal'
    );
    if (datos.intercambioId) {
      actualizar('intercambios', datos.intercambioId, { calificado: true });
    }
    return calificacion;
  };

  const actualizarCalificacion = (id, cambios) => actualizar('calificaciones', id, cambios);
  const eliminarCalificacion = (id) => eliminar('calificaciones', id);

  const toggleFavorito = (servicioId) => {
    if (!usuarioActual) return;
    setDb((d) => {
      const existe = d.favoritos.find(
        (f) => f.usuarioId === usuarioActual.id && f.servicioId === servicioId
      );
      return {
        ...d,
        favoritos: existe
          ? d.favoritos.filter((f) => f.id !== existe.id)
          : [
              {
                id: nuevoId('fav'),
                usuarioId: usuarioActual.id,
                servicioId,
              },
              ...d.favoritos,
            ],
      };
    });
  };

  /* ---------- Reportes y notificaciones ---------- */
  const crearReporte = (datos) => crear('reportes', { estado: 'Pendiente', fecha: hoy(), ...datos }, 'r');
  const actualizarReporte = (id, cambios) => actualizar('reportes', id, cambios);
  const eliminarReporte = (id) => eliminar('reportes', id);

  const marcarNotificacionesLeidas = () => {
    if (!usuarioActual) return;
    setDb((d) => ({
      ...d,
      notificaciones: d.notificaciones.map((n) =>
        n.usuarioId === usuarioActual.id ? { ...n, leida: true } : n
      ),
    }));
  };

  const value = {
    ...db,
    sesionId,
    usuarioActual,
    // genéricos
    crear,
    actualizar,
    eliminar,
    // sesión
    iniciarSesion,
    iniciarSesionComo,
    registrarse,
    cerrarSesion,
    actualizarPerfil,
    // selectores
    usuarioPorId,
    categoriaPorId,
    habilidadPorId,
    servicioPorId,
    solicitudPorId,
    intercambioPorId,
    reportePorId,
    categoriaDeHabilidad,
    habilidadDeServicio,
    categoriaDeServicio,
    saldoUsuario,
    movimientosDeUsuario,
    calificacionesDeUsuario,
    calificacionesEnviadas,
    promedioUsuario,
    serviciosDeUsuario,
    solicitudesDeUsuario,
    intercambiosDeUsuario,
    favoritosDeUsuario,
    esFavorito,
    habilidadesDeCategoria,
    serviciosDeCategoria,
    notificacionesDeUsuario,
    // mutaciones
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    crearHabilidad,
    actualizarHabilidad,
    eliminarHabilidad,
    crearServicio,
    actualizarServicio,
    eliminarServicio,
    crearSolicitud,
    actualizarSolicitud,
    eliminarSolicitud,
    aceptarSolicitud,
    rechazarSolicitud,
    confirmarIntercambio,
    completarIntercambio,
    actualizarIntercambio,
    crearMovimiento,
    transferirCreditos,
    crearCalificacion,
    actualizarCalificacion,
    eliminarCalificacion,
    toggleFavorito,
    crearReporte,
    actualizarReporte,
    eliminarReporte,
    marcarNotificacionesLeidas,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
