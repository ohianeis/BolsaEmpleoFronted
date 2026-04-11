export interface ApiResponse<T> {
  success: boolean;   // true o false
  message?: string|boolean;   // "Login correcto", "Error de validación", etc.
  data?: T;           // Aquí irá el contenido (Login, Ofertas[], etc.)
  errors?: any;      // Opcional: para detalles de errores de validación de Laravel
}

//implementacion paginación

export interface PaginatedData<T> {
  data: T[];         
  total: number;  
  current_page: number;
  last_page: number;
  per_page: number;
}

// respuesta estándar , pero apuntando a la estructura paginada
export type ApiPaginatedResponse<T> = ApiResponse<PaginatedData<T>>;