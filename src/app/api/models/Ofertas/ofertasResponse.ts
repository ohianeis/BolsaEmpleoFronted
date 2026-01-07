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