// Para los informes que devuelven total + listado (Ofertas Abiertas/Cerradas/Sin Postulantes/Empresas)
export interface InformeDetallado<T> {
  total: number;
  listado: T[];
}

export interface Direccion {
  linea1: string;
  linea2?: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
}
// Tipado de los objetos que vienen en los listados
export interface EmpresaInforme {
  id: number;
  nombre: string;
  email?: string;         // Email de contacto de la tabla empresas
  telefono_contacto?: string;
  cif?: string;
  web?: string;
  descripcion?: string;
  localidad?: string;
  
  // Relaciones que vienen del "with" en Laravel
  direccion?: Direccion; 
  user?: {
    id: number;
    email: string;       // El email de la cuenta de usuario
  };
}

export interface OfertaInforme {
  id: number;
  nombre: string;
  observacion: string;     
  tipoContrato: string;   
  horario: string;         
  fechaCierre: string;     
  nPuestos: number;        
  empresa_id: number;
  estado_id: number;
  motivo_id?: number;
  created_at: string;
  updated_at: string;
  empresa?: EmpresaInforme; 
}

// Tipado específico para el gráfico de Títulos
export interface TitulosEstadoInforme {
  totalActivos: number;
  totalInactivos: number;
  listado: { id: number; nombre: string; activado: number }[];
}