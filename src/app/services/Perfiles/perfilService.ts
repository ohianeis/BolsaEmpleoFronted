import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS_USO_COMUNES, API_ENDPOINTS_USO_DEMANDANTE } from './../../api/apiEndpoints';
import { ApiResponse } from './../../api/models/apiResponse';
import { PerfilEmpresa } from '../../api/models/Perfil/perfilResponse';
import { Situaciones } from '../../api/models/Demandantes/demantantesResponse';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
private http=inject(HttpClient);
  


  /**
   * Obtiene el perfil del usuario autenticado (Empresa o Demandante)
   * El tipo T es PerfilEmpresa (que incluye la dirección gracias al with del back)
   */
getPerfil<T>(): Observable<ApiResponse<T>> {
  return this.http.get<ApiResponse<T>>(
    API_ENDPOINTS_USO_COMUNES.perfil.verPerfil, 
  );
}

  /**
   * Actualiza los datos generales del perfil (PATCH)
   */
updatePerfil<T>(datos: Partial<T>): Observable<ApiResponse<string>> {
  return this.http.patch<ApiResponse<string>>(
    API_ENDPOINTS_USO_COMUNES.perfil.actualizarPerfil,
    datos,
  );
}
  /**
   * Crea o actualiza la dirección (POST)
   * Tu backend decide si es store o updateDireccion internamente
   */
  guardarDireccion(datosDireccion: any): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      API_ENDPOINTS_USO_COMUNES.perfil.crearDireccion,
      datosDireccion,
    );
  }

  /**
   * Obtiene el listado de situaciones (solo útil para demandantes)
   */
  getSituaciones(): Observable<Situaciones[]> {
    return this.http.get<Situaciones[]>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.detalleSituacionesPerfil,
    );
  }
}