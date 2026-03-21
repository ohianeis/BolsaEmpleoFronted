import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaginatedResponse, ApiResponse } from '../../api/models/apiResponse';
import { AdminUser } from '../../api/models/Admin/gestionAdmin';
import { API_ENDPOINTS_USO_CENTRO } from '../../api/apiEndpoints';

@Injectable({
  providedIn: 'root',
})
export class GestionAdmin {
  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Obtiene el listado de administradores (Staff) con paginación
   */
  getListadoStaff(page: number = 1, rows: number = 10): Observable<ApiPaginatedResponse<AdminUser>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('rows', rows.toString());

    return this.http.get<ApiPaginatedResponse<AdminUser>>(
      API_ENDPOINTS_USO_CENTRO.centro.listado, 
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * Crea un nuevo administrador. 
   * Retorna la contraseña temporal en el data.
   */
  crearAdmin(nuevoAdmin: { name: string, email: string }): Observable<ApiResponse<{ pass_temporal: string, usuario: string }>> {
    return this.http.post<ApiResponse<any>>(
      API_ENDPOINTS_USO_CENTRO.centro.crear,
      nuevoAdmin,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Resetea la contraseña de un administrador específico.
   * Solo ejecutable por el SuperAdmin (ID 1) hacia otros admins.
   */
  resetPasswordAdmin(idUsuario: number): Observable<ApiResponse<{ pass_temporal: string }>> {
    return this.http.post<ApiResponse<{ pass_temporal: string }>>(
      API_ENDPOINTS_USO_CENTRO.centro.resetPassword(idUsuario),
      {}, // Body vacío
      { headers: this.getHeaders() }
    );
  }
}
