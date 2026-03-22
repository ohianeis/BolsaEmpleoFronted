export interface AdminUser {
  id: number;
  name: string;
  email: string;
  status: string;      // 'activo' | 'inactivo'
  change_pass: number; // 0 o 1
  fecha_baja?: string | null;
}
// Interfaz para el formulario de creación
export interface AdminCrear {
  name: string;
  email: string;
}

// Interfaz para la respuesta de credenciales (lo que llega en res.data)
export interface AdminPass {
  pass_temporal: string;
}