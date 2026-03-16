import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../api/models/apiResponse';
import { API_ENDPOINTS_USO_DEMANDANTE, API_ENDPOINTS_USO_EMPRESA } from '../../api/apiEndpoints';
import { Cv } from '../../api/models/CV/CvResponse';

@Injectable({
  providedIn: 'root',
})
export class CvGestion {
  private http = inject(HttpClient);
private readonly STORAGE_URL = 'http://localhost:8000/storage/';
  constructor() { }

  /**
   * Helper para obtener los headers con el token de sesión
   * (Siguiendo tu estándar de BajaUsuario)
   */
  private getHeaders() {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // --- MÉTODOS PARA EL ALUMNO (DEMANDANTE) ---
/**
   * Helper privado para añadir la URL completa al objeto CV
   */
  private formatCvUrl(response: ApiResponse<Cv>): ApiResponse<Cv> {
    if (response.data && response.data.url) {
      response.data.full_url = `${this.STORAGE_URL}${response.data.url}`;
    }
    return response;
  }
  /**
   * Obtiene la información del registro del CV del propio alumno
   */
  getMiCv(): Observable<ApiResponse<Cv>> {
    return this.http.get<ApiResponse<Cv>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.miCv,
      { headers: this.getHeaders() }
    ).pipe(map(res => this.formatCvUrl(res))); // Transformamos aquí
  }
 

  /**
   * Sube el archivo PDF al servidor.
   * Al ser un archivo, enviamos el FormData directamente.
   */
  subirCv(archivo: File): Observable<ApiResponse<Cv>> {
    const formData = new FormData();
    formData.append('file', archivo);

    return this.http.post<ApiResponse<Cv>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.miCv,
      formData,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Elimina el CV del alumno (Base de datos y archivo físico)
   */
  eliminarCv(): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.miCv,
      { headers: this.getHeaders() }
    );
  }

  // --- MÉTODOS PARA LA EMPRESA ---

  /**
   * Obtiene el CV de un candidato si se cumplen los requisitos de la oferta
   * @param idOferta ID de la oferta que gestiona la empresa
   * @param idDemandante ID del alumno cuyo perfil se está consultando
   */
  verCvCandidato(idOferta: number, idDemandante: number): Observable<ApiResponse<Cv>> {
    return this.http.get<ApiResponse<Cv>>(
      API_ENDPOINTS_USO_EMPRESA.empresa.verCvCandidato(idOferta, idDemandante),
      { headers: this.getHeaders() }
    );
  }
}
