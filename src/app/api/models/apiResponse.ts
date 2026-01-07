export interface ApiResponse<T> {
  success: boolean;   // true o false
  message?: string|boolean;   // "Login correcto", "Error de validación", etc.
  data?: T;           // Aquí irá el contenido (Login, Ofertas[], etc.)
  errors?: any;      // Opcional: para detalles de errores de validación de Laravel
}