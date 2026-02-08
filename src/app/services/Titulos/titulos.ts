import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS_USO_CENTRO, API_ENDPOINTS_USO_COMUNES, API_ENDPOINTS_USO_DEMANDANTE } from '../../api/apiEndpoints';
import { ApiResponse } from '../../api/models/apiResponse';
import { TituloAlumno } from '../../api/models/Titulos/titulosResponse';

export interface Titulo {
  id: number;
  nombre: string;
}
export interface Nivel{
  id:number;
  nivel:string;
}

@Injectable({
  providedIn: 'root'
})
export class TitulosService {
  private url = API_ENDPOINTS_USO_COMUNES.perfil.titulosActivos;

  constructor(private http: HttpClient) {}

   private getHeaders() {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

getTitulosActivos(): Observable<ApiResponse<Titulo[]>> {
    return this.http.get<ApiResponse<Titulo[]>>(
      API_ENDPOINTS_USO_COMUNES.perfil.titulosActivos, 
      { headers: this.getHeaders() }
    );
  }
  getNiveles(): Observable<ApiResponse<Nivel[]>> {
  return this.http.get<ApiResponse<Nivel[]>>(
    API_ENDPOINTS_USO_CENTRO.centro.obtenerNivelesTitulo, // Asegúrate de tener este endpoint en tus constantes
    { headers: this.getHeaders() }
  );
}
// 2. Obtener los títulos que tiene el alumno 
  getMisTitulos(): Observable<ApiResponse<TituloAlumno[]>> {
    return this.http.get<ApiResponse<TituloAlumno[]>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.obtenerTitulos, // Ajusta según tu constante
      { headers: this.getHeaders() }
    );
  }
  //añadir titulo al alumno
  // Recibe un array de objetos: { id, centro, anio, cursando }
  agregarTitulosADemandante(titulosNuevos: TituloAlumno[]): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.añadirTitulo, // Ajusta según tu constante
      { titulos: titulosNuevos }, 
      { headers: this.getHeaders() }
    );
  }
eliminarTituloDemandante(idTitulo: number): Observable<ApiResponse<string>> {
  return this.http.request<ApiResponse<string>>('delete', 
    // 1. Llamamos a la función pasando el ID para construir la URL
    API_ENDPOINTS_USO_DEMANDANTE.demandante.quitarTitulo(idTitulo), 
    { 
      // 2. Enviamos el ID en el cuerpo porque tu back lo pide con $request->id
      body: { id: idTitulo }, 
      headers: this.getHeaders() 
    }
  );
}
 /* getOfertasEmpresa(): Observable<ApiResponse<Oferta[]>> {
    return this.http.get<any>(API_ENDPOINTS_USO_EMPRESA.empresa.ofertasAll, { 
      headers: this.getHeaders() 
    }).pipe(
      map(response => {
        // Si la respuesta es un Array, la convertimos al formato ApiResponse
        if (Array.isArray(response)) {
          return {
            success: true,
            data: response,
            message: 'Cargado correctamente'
          } as ApiResponse<Oferta[]>;
        }
        // Si ya venía con el formato correcto, la devolvemos tal cual
        return response as ApiResponse<Oferta[]>;
      })
    );
  }*/
  
}