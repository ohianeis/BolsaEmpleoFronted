import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../api/models/apiResponse';
import { MotivoBaja, UsuarioBaja } from '../../api/models/Bajas/BajaUsuario';
import { 
  ENDPOINTS_BAJAS, 
  API_ENDPOINTS_USO_CENTRO, 
  API_ENDPOINTS_USO_COMUNES 
} from '../../api/apiEndpoints';
@Injectable({
  providedIn: 'root',
})
export class BajaUsuario {
  constructor(private http: HttpClient) { }

  // Función privada para obtener los headers con el token
  private getHeaders() {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Listar motivos disponibles según el rol (Alumno, Empresa o Admin)
   * Usa la base de bajas /motivos
   */
  getMotivos(): Observable<ApiResponse<MotivoBaja[]>> {
    return this.http.get<ApiResponse<MotivoBaja[]>>(
      `${ENDPOINTS_BAJAS}/motivos`, 
      { headers: this.getHeaders() }
    );
  }

  /**
   * Ejecuta la baja voluntaria del propio usuario autenticado
   */
  ejecutarBajaPropia(payload: { motivo_baja_id: number; comentario?: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${ENDPOINTS_BAJAS}/ejecutar`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  // --- MÉTODOS EXCLUSIVOS DE ADMINISTRADOR (USO CENTRO) ---

  /**
   * Obtiene el historial de usuarios inactivos (paginado)
   */
  getHistorialBajas(page: number = 1): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<ApiResponse<any>>(
      API_ENDPOINTS_USO_CENTRO.centro.historialBajas,
      { 
        headers: this.getHeaders(),
        params: params
      }
    );
  }

 

  /**
   * Registra un nuevo motivo de baja
   */
  crearMotivo(data: Partial<MotivoBaja>): Observable<ApiResponse<MotivoBaja>> {
    return this.http.post<ApiResponse<MotivoBaja>>(
      API_ENDPOINTS_USO_CENTRO.centro.crearMotivo,
      data,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Actualiza un motivo de baja existente
   */
  actualizarMotivo(id: number, data: Partial<MotivoBaja>): Observable<ApiResponse<MotivoBaja>> {
    return this.http.put<ApiResponse<MotivoBaja>>(
      API_ENDPOINTS_USO_CENTRO.centro.actualizarMotivo(id),
      data,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Elimina o desactiva un motivo de baja
   */
  eliminarMotivo(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      API_ENDPOINTS_USO_CENTRO.centro.eliminarMotivo(id),
      { headers: this.getHeaders() }
    );
  }

  /**
   * Ejecuta la baja forzosa de un usuario desde el panel de administración
   * Endpoint: /api/bajas/admin-accion/{id}
   */
  bajaForzosaAdmin(idUsuario: number, data: { motivo_baja_id: number; comentario_baja?: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
API_ENDPOINTS_USO_CENTRO.centro.bajaForzosa(idUsuario),
      data,
      { headers: this.getHeaders() }
    );
  }
  reactivarUsuario(idUsuario: number): Observable<ApiResponse<any>> {
 return this.http.patch<ApiResponse<any>>(
    API_ENDPOINTS_USO_CENTRO.centro.reactivarUsuario(idUsuario), 
    {},
    { headers: this.getHeaders() } 
  );
}
  
  
}
