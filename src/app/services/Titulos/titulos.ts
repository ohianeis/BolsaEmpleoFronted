import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS_USO_CENTRO, API_ENDPOINTS_USO_COMUNES, API_ENDPOINTS_USO_DEMANDANTE } from '../../api/apiEndpoints';
import { ApiResponse } from '../../api/models/apiResponse';
import { AñadirTitulo, TituloAlumno } from '../../api/models/Titulos/titulosResponse';
import { Familia } from '../../api/models/Admin/adminModel';

export interface Titulo {
  id: number;
  nombre: string;
  familia_id: number;
  nivele_id?: number;
  nivel:Nivel;
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



getTitulosActivos(): Observable<ApiResponse<Titulo[]>> {
    return this.http.get<ApiResponse<Titulo[]>>(
      API_ENDPOINTS_USO_COMUNES.perfil.titulosActivos, 
    );
  }
  getNiveles(): Observable<ApiResponse<Nivel[]>> {
  return this.http.get<ApiResponse<Nivel[]>>(
    API_ENDPOINTS_USO_CENTRO.centro.obtenerNivelesTitulo, // Asegúrate de tener este endpoint en tus constantes
  );
}
// 2. Obtener los títulos que tiene el alumno 
  getMisTitulos(): Observable<ApiResponse<TituloAlumno[]>> {
    return this.http.get<ApiResponse<TituloAlumno[]>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.obtenerTitulos, // Ajusta según tu constante
    );
  }
  //añadir titulo al alumno
  // Recibe un array de objetos: { id, centro, anio, cursando }
  agregarTitulosADemandante(titulosNuevos: AñadirTitulo[]): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.añadirTitulo, // Ajusta según tu constante
      { titulos: titulosNuevos }, 
    );
  }
eliminarTituloDemandante(idTitulo: number): Observable<ApiResponse<string>> {
  return this.http.request<ApiResponse<string>>('delete', 
    // 1. Llamamos a la función pasando el ID para construir la URL
    API_ENDPOINTS_USO_DEMANDANTE.demandante.quitarTitulo(idTitulo), 
    { 
      // 2. Enviamos el ID en el cuerpo porque tu back lo pide con $request->id
      body: { id: idTitulo }, 
    }
  );
}
 getFamilias(): Observable<ApiResponse<Familia[]>> {
    return this.http.get<ApiResponse<Familia[]>>(
      API_ENDPOINTS_USO_CENTRO.centro.obtenerFamilias, // Asegúrate de definir esta ruta en tus constantes
    );
  }

  
}