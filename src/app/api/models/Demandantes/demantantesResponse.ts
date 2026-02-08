// models/Demandante/ofertasDemandante.ts
export interface Titulo {
  id: number;
  nombre: string;
  nivele: number;

}
export interface OfertaDemandante {
  id: number;
  nombre: string;
  tipoContrato: string;
  horario: string;
  nPuestos: number;
  empresa_nombre: string;
  created_at: string;
  demandantes_count: number;
  matchAfinidad: number;
  titulos: TituloRequerido[]; 

}

export interface InfoDemandante {
  fechaInscripcion: string;
  estadoProceso: string; // estado de oferta abierta/adjudicada/cerrada
  seguimientoCandidato: string; //estado del candidato en el proceso de la seleccion
  porcentajeAfinidad: number; //inicar al candidato match con titulos
}

//tipado si empresa permite ver direccion o no
export interface DireccionEmpresaPreview {
  linea1: string;
  linea2: string | null;
  ciudad: string;
  provincia: string;
  cp: string | null;
  visible: boolean;
}
//  modelo de la Empresa para cargar en detalleofertademandante
export interface EmpresaInfo {
  id: number;
  nombre: string;
  ubicacion: string;
  descripcion: string;
  web: string | null;
  direccion: DireccionEmpresaPreview | null;
}

export interface DetalleOfertaDemandante {
  id: number;
  nombre: string;
  observacion: string;
  tipoContrato: string;
  horario: string;
  nPuestos: number;
  estado: string;
  created_at: string;
  fechaCierre: string | null;
  motivo: string;
  empresa: EmpresaInfo;
  matchAfinidad: number;
  titulos: Titulo[];
  demandantesInscritos: number;
  infoDemandante?: InfoDemandante; // Solo si está inscrito
}

export interface TituloRequerido {
  id: number;
  nombre: string;
}
export interface TituloDemandante {
  id: number; // ID de la relación (Pivot ID)
  nombre: string;
  pivot: {
    demandante_id: number;
    titulo_id: number;
    centro: string;
    anio: number|string;
    cursando: boolean;
    activado :number|boolean;
  };
}

// Para el POST de agregar títulos
export interface AgregarTituloRequest {
  titulos: {
    id: number;
    centro: number; // ID del centro
    anio: number;
    cursando: boolean;
  }[];
}
//perfil demandante

export interface PerfilDemandante {
  id: number;
  nombre: string;
  telefono: string;
  experienciaLaboral: string;
  situacione_id: number; // OJO: El back lo devuelve así según tu controlador
  centro_id: number;
  direccion?: any;
  situacion?: any;
}