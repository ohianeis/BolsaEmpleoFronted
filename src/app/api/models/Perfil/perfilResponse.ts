export interface Direccion {
  id?: number;
  linea1: string;
  linea2?: string;
  ciudad: string;
  provincia: string;
  codigoPostal: number;
  visible: boolean;
}

export interface Centro {
  id: number;
  nombre: string;
}

export interface PerfilEmpresa {
  id: number;
  nombre: string;
  cif: string;
  localidad: string;
  descripcion: string | null;
  web: string | null;
  telefono_contacto: string | null;
  user_id: number;
  centro_id: number;
  created_at: string;
  updated_at: string;
  // Relaciones cargadas con 'with'
  direccion: Direccion | null;
  centro?: Centro;
}

// Interfaz para la respuesta completa de la API
export interface PerfilResponse {
  perfil: PerfilEmpresa;
  urls?: {
    perfil: string;
    direccion: string;
  };
}