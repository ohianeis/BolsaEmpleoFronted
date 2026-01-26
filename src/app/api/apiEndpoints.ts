export const API_BASE_URL = 'http://localhost:8000/api';
export const ENDPOINTS_AUTH = `${API_BASE_URL}/registro`;
export const ENDPOINTS_INFORMES = `${API_BASE_URL}/informes`;
export const ENDPOINTS_OFERTAS = `${API_BASE_URL}/ofertas`;
export const ENDPOINTS_PERFIL = `${API_BASE_URL}/perfil`;
export const ENDPOINTS_TITULOS = `${API_BASE_URL}/titulos`;
export const ENDPOINTS_TITULOS_DEMANDANTE = `${API_BASE_URL}/titulos/demandante`;
export const ENDPOINTS_VALIDACIONES = `${API_BASE_URL}/usuarios/validaciones/`;

//endpoints auth
export const API_ENDPOINTS_AUTH = {
  auth: {
    login: `${API_BASE_URL}/login`,
    registro: `${ENDPOINTS_AUTH}`,
    roles: `${ENDPOINTS_AUTH}/roles`,
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
      obtenerTodosTitulos:`${ENDPOINTS_TITULOS}`,
    crearTitulo:`${ENDPOINTS_TITULOS}`,
    obtenerNivelesTitulo:`${ENDPOINTS_TITULOS}/niveles/listado`,
    detalleTitulo:(idTitulo:number)=>`${ENDPOINTS_TITULOS}/${idTitulo}`,
    eliminarTitulo:(idTitulo:number)=>`${ENDPOINTS_TITULOS}/${idTitulo}`,
    actualizarTitulo:(idTitulo:number)=>`${ENDPOINTS_TITULOS}/${idTitulo}`,
    listadoValidacions:`${ENDPOINTS_VALIDACIONES}`,
    noValidar:(idUsuario:number)=>`${ENDPOINTS_VALIDACIONES}/${idUsuario}`,
    siValidar:(IdUsuario:number)=>`${ENDPOINTS_VALIDACIONES}/${IdUsuario}`
  
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
    estadoCandidato:(idOferta:number,idCandidato:number)=>`${ENDPOINTS_OFERTAS}/${idOferta}/candidatos/${idCandidato}/seguimiento`,
    seguimientoCandidato:`${ENDPOINTS_OFERTAS}/estados-candidatos`,
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
    detalleSituacionesPerfil:`${ENDPOINTS_PERFIL}/situaciones`,
    obtenerTitulos:`${ENDPOINTS_TITULOS_DEMANDANTE}`
  },
};
export const API_ENDPOINTS_USO_COMUNES = {
  perfil: {
    verPerfil: `${ENDPOINTS_PERFIL}`,
    crearDireccion: `${ENDPOINTS_PERFIL}/direccion`,
    actualizarPerfil: `${ENDPOINTS_PERFIL}/editar`,
    titulosActivos:`${ENDPOINTS_TITULOS}/activos`,
    asociarTitulos:`${ENDPOINTS_TITULOS_DEMANDANTE}`,
    eliminarTitulo:(idTitulo:number)=>`${ENDPOINTS_TITULOS_DEMANDANTE}/${idTitulo}`
    
  },
};
