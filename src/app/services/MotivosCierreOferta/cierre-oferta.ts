import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../../api/models/apiResponse';
import { DetalleMotivo, Motivo } from '../../api/models/MotivoCierreOferta/motivoCierreResponse';
import { Observable } from 'rxjs';
import { API_ENDPOINTS_USO_CENTRO, API_ENDPOINTS_USO_EMPRESA } from '../../api/apiEndpoints';

@Injectable({
  providedIn: 'root',
})
export class CierreOferta {
  private http=inject(HttpClient)
  
  /** * USO EMPRESA: Obtener motivos de cierre específicos (activos) 
   * @param motivoId 1 para 'Con demandante', 2 para 'Sin demandante'
   */
  getDetallesActivos(): Observable<ApiResponse<DetalleMotivo[]>> {
    return this.http.get<ApiResponse<DetalleMotivo[]>>(
      API_ENDPOINTS_USO_EMPRESA.empresa.obtenerDetallesCierreActivos,
   
    );
  }

  /** * USO ADMINISTRADOR: Listar toda la configuración (árbol de motivos)
   */
  getConfiguracionAdmin(): Observable<ApiResponse<Motivo[]>> {
    return this.http.get<ApiResponse<Motivo[]>>(
      API_ENDPOINTS_USO_CENTRO.centro.listarMotivosCierreAdmin,
     
    );
  }

  /** * USO ADMINISTRADOR: Crear un nuevo detalle de motivo
   */
  crearDetalle(nuevoDetalle: Partial<DetalleMotivo>): Observable<ApiResponse<DetalleMotivo>> {
    return this.http.post<ApiResponse<DetalleMotivo>>(
      API_ENDPOINTS_USO_CENTRO.centro.crearDetalleCierre,
      nuevoDetalle,
     
    );
  }

  /** * USO ADMINISTRADOR: Actualizar nombre o estado (activo/inactivo)
   */
  actualizarDetalle(id: number, datos: Partial<DetalleMotivo>): Observable<ApiResponse<DetalleMotivo>> {
    return this.http.patch<ApiResponse<DetalleMotivo>>(
      API_ENDPOINTS_USO_CENTRO.centro.actualizarDetalleCierre(id),
      datos,
    
    );
  }
}
