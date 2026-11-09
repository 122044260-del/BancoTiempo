// Registro central de pantallas. Cada nombre es una ruta que usa useNav().
import BienvenidaScreen from '../screens/acceso/BienvenidaScreen';
import IniciarSesionScreen from '../screens/acceso/IniciarSesionScreen';
import RegistroScreen from '../screens/acceso/RegistroScreen';
import RecuperarContrasenaScreen from '../screens/acceso/RecuperarContrasenaScreen';

import InicioScreen from '../screens/usuario/InicioScreen';
import ExplorarScreen from '../screens/usuario/ExplorarScreen';
import MiPerfilScreen from '../screens/usuario/MiPerfilScreen';
import EditarPerfilScreen from '../screens/usuario/EditarPerfilScreen';
import FavoritosScreen from '../screens/usuario/FavoritosScreen';

import ServiciosScreen from '../screens/servicios/ServiciosScreen';
import ServicioFormScreen from '../screens/servicios/ServicioFormScreen';
import ServicioDetalleScreen from '../screens/servicios/ServicioDetalleScreen';

import SolicitudesScreen from '../screens/solicitudes/SolicitudesScreen';
import SolicitudFormScreen from '../screens/solicitudes/SolicitudFormScreen';
import SolicitudDetalleScreen from '../screens/solicitudes/SolicitudDetalleScreen';

import IntercambiosScreen from '../screens/intercambios/IntercambiosScreen';
import IntercambioDetalleScreen from '../screens/intercambios/IntercambioDetalleScreen';

import CreditosScreen from '../screens/creditos/CreditosScreen';
import CreditoFormScreen from '../screens/creditos/CreditoFormScreen';

import CalificacionesScreen from '../screens/calificaciones/CalificacionesScreen';
import CalificacionFormScreen from '../screens/calificaciones/CalificacionFormScreen';

import PanelGlobalScreen from '../screens/admin/PanelGlobalScreen';
import UsuariosScreen from '../screens/admin/UsuariosScreen';
import UsuarioFormScreen from '../screens/admin/UsuarioFormScreen';
import UsuarioDetalleScreen from '../screens/admin/UsuarioDetalleScreen';
import CategoriasScreen from '../screens/admin/CategoriasScreen';
import CategoriaFormScreen from '../screens/admin/CategoriaFormScreen';
import CategoriaDetalleScreen from '../screens/admin/CategoriaDetalleScreen';
import HabilidadesScreen from '../screens/admin/HabilidadesScreen';
import HabilidadFormScreen from '../screens/admin/HabilidadFormScreen';
import HabilidadDetalleScreen from '../screens/admin/HabilidadDetalleScreen';
import ReportesScreen from '../screens/admin/ReportesScreen';
import ReporteDetalleScreen from '../screens/admin/ReporteDetalleScreen';
import AjustesSistemaScreen from '../screens/admin/AjustesSistemaScreen';

export const screens = {
  // Acceso
  Bienvenida: BienvenidaScreen,
  IniciarSesion: IniciarSesionScreen,
  Registro: RegistroScreen,
  Recuperar: RecuperarContrasenaScreen,
  // Usuario general
  Inicio: InicioScreen,
  Explorar: ExplorarScreen,
  MiPerfil: MiPerfilScreen,
  EditarPerfil: EditarPerfilScreen,
  Favoritos: FavoritosScreen,
  // Servicios
  Servicios: ServiciosScreen,
  ServicioForm: ServicioFormScreen,
  ServicioDetalle: ServicioDetalleScreen,
  // Solicitudes
  Solicitudes: SolicitudesScreen,
  SolicitudForm: SolicitudFormScreen,
  SolicitudDetalle: SolicitudDetalleScreen,
  // Intercambios
  Intercambios: IntercambiosScreen,
  IntercambioDetalle: IntercambioDetalleScreen,
  // Créditos
  Creditos: CreditosScreen,
  CreditoForm: CreditoFormScreen,
  // Calificaciones
  Calificaciones: CalificacionesScreen,
  CalificacionForm: CalificacionFormScreen,
  // Administración · usuarios
  PanelGlobal: PanelGlobalScreen,
  Usuarios: UsuariosScreen,
  UsuarioForm: UsuarioFormScreen,
  UsuarioDetalle: UsuarioDetalleScreen,
  // Administración · catálogo
  Categorias: CategoriasScreen,
  CategoriaForm: CategoriaFormScreen,
  CategoriaDetalle: CategoriaDetalleScreen,
  Habilidades: HabilidadesScreen,
  HabilidadForm: HabilidadFormScreen,
  HabilidadDetalle: HabilidadDetalleScreen,
  // Administración · reportes y ajustes
  Reportes: ReportesScreen,
  ReporteDetalle: ReporteDetalleScreen,
  Ajustes: AjustesSistemaScreen,
};
