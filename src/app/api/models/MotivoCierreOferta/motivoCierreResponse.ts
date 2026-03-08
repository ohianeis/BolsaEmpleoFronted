export interface DetalleMotivo {
  id: number;
  nombre: string;
  motivo_id: number;
  activo: boolean; 
  created_at?: string;
  updated_at?: string;
}

export interface Motivo {
  id: number;
  nombre: string; 
  detalles?: DetalleMotivo[]; 
}