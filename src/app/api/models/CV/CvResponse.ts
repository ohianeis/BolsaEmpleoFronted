/**
 * Interfaz que representa el registro de un Currículum en la base de datos
 */
export interface Cv {
    id: number;
    demandante_id: number;
    nombre: string;     // Nombre original del archivo (ej: "mi_cv_final.pdf")
    url: string;        // Ruta interna en el servidor (ej: "cvs/cv_1_1710580.pdf")
    full_url: string;   // URL completa para el navegador (ej: "http://localhost:8000/storage/cvs/...")
    created_at: string;
    updated_at: string;
}

/**
 * Interfaz para las respuestas del servidor que devuelven un objeto CV
 * Basado en tu estructura genérica ApiResponse<T>
 */
export interface CvResponse {
    message: string;
    data: Cv;
}