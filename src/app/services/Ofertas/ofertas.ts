import { API_ENDPOINTS_USO_EMPRESA } from './../../api/apiEndpoints';
import { ApiResponse } from './../../api/models/apiResponse';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Oferta } from '../../api/models/Ofertas/ofertasResponse';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {

  constructor(private http: HttpClient) { }

  // Función privada para obtener los headers con el token
  private getHeaders() {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Obtiene todas las ofertas para la empresa (Usa tu constante ofertasAll)
   * El tipo T de ApiResponse será un array de cualquier objeto (puedes crear una interface Oferta luego)
   */
 getOfertasEmpresa(): Observable<ApiResponse<Oferta[]>> {
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
}

  /**
   * Registra una nueva oferta
   */
  crearOferta(datosOferta: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      API_ENDPOINTS_USO_EMPRESA.empresa.registrarOferta, 
      datosOferta,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Obtiene el detalle de una oferta específica
   */
  getDetalleOferta(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      API_ENDPOINTS_USO_EMPRESA.empresa.detalleOferta(id),
      { headers: this.getHeaders() }
    );
  }
  // Para ver quién se ha apuntado a una oferta
  getCandidatosInscritos(idOferta: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      API_ENDPOINTS_USO_EMPRESA.empresa.todosCandidatosInscritos(idOferta),
      { headers: this.getHeaders() }
    );
  }

  // Para cerrar una oferta desde el botón del dashboard
  cerrarOferta(idOferta: number): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      API_ENDPOINTS_USO_EMPRESA.empresa.cerrarOferta(idOferta),
      {}, // Body vacío si Laravel solo espera el ID por URL
      { headers: this.getHeaders() }
    );
  }
}