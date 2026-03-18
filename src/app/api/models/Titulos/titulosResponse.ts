export interface TituloAlumno {
  id: number;       // Este es el ID de la tabla PIVOT (importante para borrar)
  titulo_id:number;//id real titulo
  nombre: string;   // Nombre del título (ej: "DAW")
  anio: number;      // Año de finalización
  centro: string;   // Centro donde lo cursó
  cursando: boolean;
  activado:number;
}
export interface AñadirTitulo {
  id: number;       // Este es el ID de la tabla PIVOT (importante para borrar)
  anio: number;      // Año de finalización
  centro: string;   // Centro donde lo cursó
  cursando: boolean;
}