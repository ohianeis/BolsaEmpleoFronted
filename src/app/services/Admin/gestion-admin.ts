import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaginatedResponse, ApiResponse } from '../../api/models/apiResponse';
import { AdminUser } from '../../api/models/Admin/gestionAdmin';
import { API_ENDPOINTS_USO_CENTRO } from '../../api/apiEndpoints';
import { PaginacionBase } from '../Paginación/paginacion-base';

@Injectable({
  providedIn: 'root',
})
export class GestionAdmin extends PaginacionBase{
constructor(http: HttpClient) { 
    super(http); // Inyectar http al padre
  }


  /**
   * Obtiene el listado de administradores (Staff) con paginación
   */
 getListadoStaff(page: number = 0, rows: number = 10): Observable<ApiPaginatedResponse<AdminUser>> {
    return this.getPaginated<AdminUser>(
      API_ENDPOINTS_USO_CENTRO.centro.listado, 
      page, 
      rows
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
     
    );
  }
}
