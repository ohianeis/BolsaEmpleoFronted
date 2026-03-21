export interface AdminUser {
  id: number;
  name: string;
  email: string;
  status: string;      // 'activo' | 'inactivo'
  change_pass: number; // 0 o 1
  fecha_baja?: string | null;
}