/**
 * @file services.jsx
 * @description Punto de entrada centralizado para los servicios de la aplicación.
 * Re-exporta todos los servicios modulares para facilitar su importación en los componentes.
 */

// Importación de todos los servicios específicos como alias para agruparlos
import * as usuariosService from "./usuarios.service.jsx";
import * as arbolesService from "./arboles.service.jsx";
import * as statsTiposService from "./statsTipos.service.jsx";
import * as voluntariadosService from "./voluntariados.service.jsx";
import * as abonosService from "./abonos.service.jsx";
import * as reportesVoluntariadoService from "./reportesVoluntariado.service.jsx";
import * as reportesService from "./reportes.service.jsx";
import * as reportesRobadosService from "./reportesRobados.service.jsx";
import * as solicitudesVoluntariadoService from "./solicitudesVoluntariado.service.jsx";
import * as tareasDisponiblesService from "./tareasDisponibles.service.jsx";
import * as cloudinaryService from "./cloudinary.service.jsx";


/**
 * Objeto que agrupa todos los métodos de los servicios individuales.
 * Útil para importar el servicio completo mediante: import services from '...';
 * @type {Object}
 */
const services = {
  ...usuariosService,
  ...arbolesService,
  ...statsTiposService,
  ...voluntariadosService,
  ...abonosService,
  ...reportesVoluntariadoService,
  ...reportesService,
  ...reportesRobadosService,
  ...solicitudesVoluntariadoService,
  ...tareasDisponiblesService,
  ...cloudinaryService,
};

// Exportación por defecto del objeto unificado
export default services;

// Re-exportación de funciones individuales para soporte de importaciones nombradas: 
// Ejemplo: import { getUsuarios } from '...';

export {
  getUsuarios,
  postUsuarios,
  putUsuarios,
  deleteUsuarios,
} from "./usuarios.service.jsx";

export {
  getArboles,
  postArboles,
  putArboles,
  deleteArboles,
} from "./arboles.service.jsx";

export {
  getStatsTipos,
  postStatsTipos,
  putStatsTipos,
  deleteStatsTipos,
} from "./statsTipos.service.jsx";

export {
  getVoluntariados,
  postVoluntariados,
  putVoluntariados,
  deleteVoluntariados,
} from "./voluntariados.service.jsx";

export {
  getAbonos,
  postAbonos,
  putAbonos,
  deleteAbonos,
} from "./abonos.service.jsx";

export {
  getReportesVoluntariado,
  postReporteVoluntariado,
  putReporteVoluntariado,
} from "./reportesVoluntariado.service.jsx";

export {
  getReportes,
  postReportes,
  putReportes,
  deleteReportes,
} from "./reportes.service.jsx";

export {
  getReportesRobados,
  postReportesRobados,
  putReportesRobados,
  deleteReportesRobados,
} from "./reportesRobados.service.jsx";

export {
  getSolicitudesVoluntariado,
  postSolicitudVoluntariado,
  putSolicitudVoluntariado,
  deleteSolicitudVoluntariado,
} from "./solicitudesVoluntariado.service.jsx";

export {
  getTareasDisponibles,
  postTareaDisponible,
  putTareaDisponible,
  deleteTareaDisponible,
} from "./tareasDisponibles.service.jsx";

export {
  uploadImage,
} from "./cloudinary.service.jsx";
