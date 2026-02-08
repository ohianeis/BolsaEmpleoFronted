export interface TituloAlumno {
  id: number;       // Este es el ID de la tabla PIVOT (importante para borrar)
  nombre: string;   // Nombre del título (ej: "DAW")
  anio: number;      // Año de finalización
  centro: string;   // Centro donde lo cursó
  cursando: boolean;
}