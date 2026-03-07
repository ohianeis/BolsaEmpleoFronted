export const API_BASE_URL = 'http://localhost:8000/api';
export const ENDPOINTS_AUTH = `${API_BASE_URL}/registro`;
export const ENDPOINTS_INFORMES = `${API_BASE_URL}/informes`;
export const ENDPOINTS_OFERTAS = `${API_BASE_URL}/ofertas`;
export const ENDPOINTS_PERFIL = `${API_BASE_URL}/perfil`;
export const ENDPOINTS_TITULOS = `${API_BASE_URL}/titulos`;
export const ENDPOINTS_TITULOS_DEMANDANTE = `${API_BASE_URL}/titulos/demandante`;
export const ENDPOINTS_VALIDACIONES = `${API_BASE_URL}/usuarios/validaciones`;
export const ENDPOINTS_BAJAS = `${API_BASE_URL}/bajas`;

//endpoints auth
export const API_ENDPOINTS_AUTH = {
  auth: {
    login: `${API_BASE_URL}/login`,
    logout: `${API_BASE_URL}/logout`,
    registro: `${ENDPOINTS_AUTH}`,
    roles: `${ENDPOINTS_AUTH}/roles`,
    perfilAuth: `${API_BASE_URL}/perfil-auth`,
  },
};

//endpoints informes
export const API_ENDPOINTS_USO_CENTRO = {
  centro: {
    ofertasAsignadas: `${ENDPOINTS_INFORMES}/ofertasAsignadas`,
    ofertasCerradas: `${ENDPOINTS_INFORMES}/ofertasCerradas`,
    ofertasAbiertas: `${ENDPOINTS_INFORMES}/ofertasAbiertas`,
    totalDemandantes: `${ENDPOINTS_INFORMES}/totalDemandantes`,
    totalEmpresas: `${ENDPOINTS_INFORMES}/totalEmpresas`,
    titulosEstado: `${ENDPOINTS_INFORMES}/titulosEstado`,
    empresasSinOfertas: `${ENDPOINTS_INFORMES}/empresasSinOfertas`,
    ofertasSinPostulantes: `${ENDPOINTS_INFORMES}/ofertasSinPostulantes`,
    detalleOfertaAdmin: (idOferta: number) => `${ENDPOINTS_INFORMES}/oferta/${idOferta}`,
    detalleEmpresa: (idEmpresa: number) => `${ENDPOINTS_INFORMES}/empresa/${idEmpresa}`,
    detalleAlumnoAdmin: (idAlumno: number) => `${ENDPOINTS_INFORMES}/alumno/${idAlumno}`,
    todosAlumnos: `${ENDPOINTS_INFORMES}/all-alumnos`,
    todasEmpresas: `${ENDPOINTS_INFORMES}/all-empresas`,
    reportesEspeciales: (tipo: string) => `${ENDPOINTS_INFORMES}/reportes/${tipo}`,
    obtenerTodosTitulos: `${ENDPOINTS_TITULOS}`,
    crearTitulo: `${ENDPOINTS_TITULOS}`,
    obtenerNivelesTitulo: `${ENDPOINTS_TITULOS}/niveles/listado`,
    detalleTitulo: (idTitulo: number) => `${ENDPOINTS_TITULOS}/${idTitulo}`,
    eliminarTitulo: (idTitulo: number) => `${ENDPOINTS_TITULOS}/${idTitulo}`,
    actualizarTitulo: (idTitulo: number) => `${ENDPOINTS_TITULOS}/${idTitulo}`,
    obtenerFamilias: `${ENDPOINTS_TITULOS}/familias`,
    crearFamilia: `${ENDPOINTS_TITULOS}/familias`,
    actualizarFamilia: (id: number) => `${ENDPOINTS_TITULOS}/familias/${id}`,
    eliminarFamilia: (id: number) => `${ENDPOINTS_TITULOS}/familias/${id}`,
    listadoValidacions: `${ENDPOINTS_VALIDACIONES}`,
    validacionesPendientes: `${ENDPOINTS_VALIDACIONES}/pendientes`,
    noValidar: (idUsuario: number) => `${ENDPOINTS_VALIDACIONES}/${idUsuario}`,
    siValidar: (IdUsuario: number) => `${ENDPOINTS_VALIDACIONES}/${IdUsuario}`,
    historialBajas: `${ENDPOINTS_BAJAS}/historial`,
    listarMotivosAdmin: `${ENDPOINTS_BAJAS}/motivos`,
    crearMotivo: `${ENDPOINTS_BAJAS}/motivos`,
    actualizarMotivo: (id: number) => `${ENDPOINTS_BAJAS}/motivos/${id}`,
    eliminarMotivo: (id: number) => `${ENDPOINTS_BAJAS}/motivos/${id}`,
    bajaForzosa: (idUsuario: number) => `${ENDPOINTS_BAJAS}/admin/baja-forzosa/${idUsuario}`,
    reactivarUsuario: (id: number) => `${ENDPOINTS_BAJAS}/reactivar/${id}`,
  },
};
export const API_ENDPOINTS_USO_EMPRESA = {
  empresa: {
    ofertasAll: `${ENDPOINTS_OFERTAS}`,
    detalleOferta: (idOferta: number) => `${ENDPOINTS_OFERTAS}/${idOferta}`,
    registrarOferta: `${ENDPOINTS_OFERTAS}`,
    todosCandidatosInscritos: (idOferta: number) => `${ENDPOINTS_OFERTAS}/${idOferta}/candidatos`,
    detalleDemandateInscrito: (idOferta: number, idDemandante: number) =>
      `${ENDPOINTS_OFERTAS}/${idOferta}/candidatos/${idDemandante}`,
    totalEmpresas: `${ENDPOINTS_INFORMES}/totalEmpresas`,
    demandatesNoInscritos: (idOferta: number) => `${ENDPOINTS_OFERTAS}/${idOferta}/noInscritos`,
    añadirCandidatoOferta: (idOferta: number, idDemandante: number) =>
      `${ENDPOINTS_OFERTAS}/${idOferta}/candidatos/${idDemandante}/inscribir`,
    cerrarOferta: (idOferta: number) => `${ENDPOINTS_OFERTAS}/${idOferta}/cerrar`,
    asignarOferta: (idOferta: number, idDemandante: number) =>
      `${ENDPOINTS_OFERTAS}/${idOferta}/asignar/${idDemandante}`,
    estadoCandidato: (idOferta: number, idCandidato: number) =>
      `${ENDPOINTS_OFERTAS}/${idOferta}/candidatos/${idCandidato}/seguimiento`,
    seguimientoCandidato: `${ENDPOINTS_OFERTAS}/estados-candidatos`,
    stats: `${API_BASE_URL}/empresa/stats`,
  },
};
export const API_ENDPOINTS_USO_DEMANDANTE = {
  demandante: {
    ofertasAll: `${ENDPOINTS_OFERTAS}`,
    detalleOferta: (idOferta: number) => `${ENDPOINTS_OFERTAS}/${idOferta}`,
    inscribirseOferta: (idOferta: number) => `${ENDPOINTS_OFERTAS}/${idOferta}/apuntarse`,
    desapuntarseOferta: (idOferta: number) => `${ENDPOINTS_OFERTAS}/${idOferta}/desapuntarse`,
    listadoOfertasInscrito: `${ENDPOINTS_OFERTAS}/inscritas/listado`,
    detalleSituacionesPerfil: `${ENDPOINTS_PERFIL}/situaciones`,
    obtenerTitulos: `${ENDPOINTS_TITULOS_DEMANDANTE}`,
    añadirTitulo: `${ENDPOINTS_TITULOS_DEMANDANTE}`,
    quitarTitulo: (idTitulo: number) => `${ENDPOINTS_TITULOS_DEMANDANTE}/${idTitulo}`,
  },
};
export const API_ENDPOINTS_USO_COMUNES = {
  perfil: {
    verPerfil: `${ENDPOINTS_PERFIL}`,
    crearDireccion: `${ENDPOINTS_PERFIL}/direccion`,
    actualizarPerfil: `${ENDPOINTS_PERFIL}/editar`,
    titulosActivos: `${ENDPOINTS_TITULOS}/activos`,
    asociarTitulos: `${ENDPOINTS_TITULOS_DEMANDANTE}`,
    eliminarTitulo: (idTitulo: number) => `${ENDPOINTS_TITULOS_DEMANDANTE}/${idTitulo}`,
  },
};
