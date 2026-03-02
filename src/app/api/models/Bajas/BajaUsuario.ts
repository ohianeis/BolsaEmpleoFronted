// El motivo de baja que viene de la tabla 'motivo_bajas'
export interface MotivoBaja {
  id: number;
  motivo: string;
  visible_alumno: boolean;
  visible_empresa: boolean;
  solo_admin: boolean;
  activo: boolean; // Para el borrado lógico 
  created_at?: string;
  updated_at?: string;
}

// Estructura del Usuario en el historial de bajas
export interface UsuarioBaja {
  id: number;
  nombre: string;
  email: string;
  status: 'activo' | 'inactivo';
  rol: {
    id: number;
    nombre: string;
  };
  motivo_baja?: MotivoBaja;
  comentario_baja?: string;
  fecha_baja: string;
  validado: boolean;
}
export interface BajaRequest {
  motivo_baja_id: number|null;
  comentario?: string;
}
export interface userBaja{
  id:number
  nombre:string;
  email:string;
  rol:string;
  identificador:string;
  motivo:string;
  comentario:string;
  fecha_de_baja:string

}