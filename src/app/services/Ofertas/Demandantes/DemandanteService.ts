
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../../api/models/apiResponse';
import { API_ENDPOINTS_USO_DEMANDANTE } from '../../../api/apiEndpoints';
import { AgregarTituloRequest, DetalleOfertaDemandante, OfertaDemandante, TituloDemandante } from '../../../api/models/Demandantes/demantantesResponse';

@Injectable({
  providedIn: 'root'
})
export class DemandanteService {
     constructor(private http: HttpClient) { }

  // Función privada para obtener los headers con el token
  private getHeaders() {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Ofertas generales para el demandante (incluye 'inscrito: boolean')
  getOfertas(): Observable<ApiResponse<OfertaDemandante[]>> {
    return this.http.get<ApiResponse<OfertaDemandante[]>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.ofertasAll,
      { headers: this.getHeaders() }
    );
  }
// Ver detalle de una oferta específica
  getDetalleOferta(id: number): Observable<ApiResponse<DetalleOfertaDemandante>> {
    return this.http.get<ApiResponse<DetalleOfertaDemandante>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.detalleOferta(id),
      { headers: this.getHeaders() }
    );
  }

  // Listado de ofertas donde el usuario ya está inscrito
  getMisInscripciones(): Observable<ApiResponse<DetalleOfertaDemandante[]>> {
    return this.http.get<ApiResponse<DetalleOfertaDemandante[]>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.listadoOfertasInscrito,
      { headers: this.getHeaders() }
    );
  }

  // --- ACCIONES SOBRE OFERTAS ---

  inscribirse(id: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.inscribirseOferta(id),
      {}, // Cuerpo vacío para el POST
      { headers: this.getHeaders() }
    );
  }

  desapuntarse(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.desapuntarseOferta(id),
      { headers: this.getHeaders() }
    );
  }

  // --- PERFIL Y TÍTULOS ---

  getTitulos(): Observable<ApiResponse<TituloDemandante[]>> {
    return this.http.get<ApiResponse<TituloDemandante[]>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.obtenerTitulos,
      { headers: this.getHeaders() }
    );
  }
asociarTitulos(data: AgregarTituloRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.obtenerTitulos, // Según tu endpoint para POST
      data,
      { headers: this.getHeaders() }
    );
  }
  getSituacionesPerfil(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.detalleSituacionesPerfil,
      { headers: this.getHeaders() }
    );
  }
}