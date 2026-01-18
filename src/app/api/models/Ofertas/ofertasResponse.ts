export interface Oferta {
  id: number;
  nombre: string;
  observacion: string;
  tipoContrato: string;
  horario: string;
  nPuestos: number;
  estado_id: 'Abierta' | 'Cerrada'; // Puedes usar tipos literales si los conoces
  empresa_id: number;
  empresa_nombre: string;
  created_at: string;
}
//dtos a enviar para crear una oferta
export interface RegistrarOfertaRequest {
  nombre: string;
  observacion: string;
  tipoContrato: string;
  horario: string;
  nPuestos: number;
  titulo: number[]; 
}
// Lo que responde Laravel en caso de éxito
export interface RegistrarOfertaResponse {
  mensaje: string;
  id: number;
  empresa_id: number;
  titulo_id: number;
}
//para obtener detalle oferta por id
export interface TituloDetalle {
  nombre: string;
  nivele_id: number;
  nivel: string;
}

export interface InfoDemandante {
  fechaInscripcion: string;
  estadoProceso: string;
}

export interface OfertaDetalle {
  id: number;
  nombre: string;
  observacion: string;
  tipoContrato: string;
  horario: string;
  nPuestos: number;
  estado: string;
  fechaCierre: string | null;
  empresa: string;
  motivo: string;
  titulos: TituloDetalle[];
  demandantesInscritos: number;
  created_at: string;
  candidatoAsignado?: number | null;
  infoDemandante?: InfoDemandante; // Solo vendrá si el usuario es un demandante inscrito
}
//resumen candidatos apuntados a una oferta
export interface CandidatoResumen {
  id: number;
  nombre: string;
  telefono: number;
  experienciaLaboral: string;
  alta: string;              // Fecha de registro en la App
  fecha_inscripcion: string; // Fecha en la que se apuntó a la oferta
  revisado: boolean;          // 0 o 1 en BD, boolean en TS
  estado_candidato_id: number; 
  notas_reclutador?: string | null; // Opcional porque puede estar vacío
}
//detalle amplio del candidato
export interface Direccion {
  linea1: string;
  linea2?: string;      
  ciudad: string;
  provincia: string;    
  codigo_postal: string;
}

export interface InfoTitulo {
  titulo_id: number;
  nombre: string;
  estado: string;      
  año: number;
  centro: string;
}

export interface CandidatoCompleto {
  id: number;
  nombre: string;
  telefono: string;
  experienciaLaboral: string;
  situacion: string;
  centro: string;      
  direccion: Direccion;
  infoTitulos: InfoTitulo[];
    estado_candidato_id: number; 
  notas_reclutador?: string | null; // Opcional porque puede estar vacío
}

//candidatos sugeridos para una oferta
// En tu archivo de modelos/interfaces
export interface CandidatoElegible {
  id: number;
  nombre: string;
  telefono: number;
  experienciaLaboral: string;
  situacione_id: number;
  centro_id: number;
  user_id: number | null;
  created_at: string;
  updated_at: string;
}

//estado proceso candidatos que puede tener
export interface EstadoCandidato {
  id: number;
  nombre: string;
}