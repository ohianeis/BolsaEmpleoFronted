export interface Rol {
    id: number;
    rol: string;
}

export interface UsuarioPendiente {
    id: number;
    name: string;
    email: string;
    validado: number;
    role_id: number;
    created_at: string;
    rol: Rol; 
}

//para gestionar titulos
export interface Nivel {
    id: number;
    nivel: string;
}

export interface TituloAdmin {
    id: number;
    titulo: string; //el controlador lo mapea como 'titulo' no como 'nombre' en el index
    estado: 'activo' | 'inactivo';
    nivel: string;
}

// Para el detalle y el formulario de creación/edición
export interface TituloRequest {
    nombre: string;
    nivel: number; // ID del nivel
    centro: number; // ID del centro
}
export interface UsuarioBase {
  id: number;
  nombre: string;
  email: string;
  validado: number; // 0 o 1
  telefono?: string;
  created_at: string;
}

export interface AlumnoListado extends UsuarioBase {
  titulos: string[]; // Los nombres de los títulos que "pluckeamos" en Laravel
}

export interface EmpresaListado extends UsuarioBase {
  cif: string | null;
  web: string | null;
}
export interface NivelDatos {
  demandante_id: number;
  titulo_id: number;
  centro: string;
  año: string;
  cursando: number; // 0 o 1
}
export interface TituloDetalle {
  id: number;
  nombre: string;
  nivele_id: number;
  // Reflejamos la relación 'with(nivel)' de Laravel
  nivel?: {
    id: number;
    nivel: string; // "Grado Superior", etc.
  };
  // Reflejamos los datos de la tabla intermedia
  pivot: NivelDatos;
}

export interface AlumnoExpediente extends UsuarioBase {
  experienciaLaboral?: string; 
  user: {
    id: number;
    email: string;
  };
  titulos: TituloDetalle[];
}
export interface Direccion {
  id: number;
  linea1: string;
  linea2?: string;
  ciudad: string;
  provincia: string;
  codigoPostal: number; // En tu JSON viene como número
  visible: number;
}
export interface EmpresaExpediente extends UsuarioBase {
  cif: string | null;
  descripcion: string | null;
  localidad: string | null;
  web: string | null;
  telefono_contacto: string | null;
  direccion?: Direccion; // Usamos la interfaz de arriba
  user: {
    id: number;
    email: string;
    validado: number;
  };
}