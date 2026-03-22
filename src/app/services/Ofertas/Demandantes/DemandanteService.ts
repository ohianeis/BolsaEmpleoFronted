
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiPaginatedResponse, ApiResponse } from '../../../api/models/apiResponse';
import { API_ENDPOINTS_USO_DEMANDANTE } from '../../../api/apiEndpoints';
import { AgregarTituloRequest, DetalleOfertaDemandante, OfertaDemandante, Situaciones, TituloDemandante } from '../../../api/models/Demandantes/demantantesResponse';
import { PaginacionBase } from '../../Paginación/paginacion-base';

@Injectable({
  providedIn: 'root'
})
export class DemandanteService extends PaginacionBase{
constructor(http: HttpClient) {
    super(http); // Pasamos http al padre
  }
  

  // Ofertas generales para el demandante (incluye 'inscrito: boolean') con paginacion
getOfertas(page: number = 0, rows: number = 10): Observable<ApiPaginatedResponse<OfertaDemandante>> {
    return this.getPaginated<OfertaDemandante>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.ofertasAll,
      page,
      rows
    );
  }
// Ver detalle de una oferta específica
  getDetalleOferta(id: number): Observable<ApiResponse<DetalleOfertaDemandante>> {
    return this.http.get<ApiResponse<DetalleOfertaDemandante>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.detalleOferta(id),
     
    );
  }

  // Listado de ofertas donde el usuario ya está inscrito
getMisInscripciones(page: number = 0, rows: number = 10, tab: string = 'activas'): Observable<ApiPaginatedResponse<DetalleOfertaDemandante>> {
    return this.getPaginated<DetalleOfertaDemandante>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.listadoOfertasInscrito,
      page,
      rows,
      { tab } // La clase base se encarga de meter &tab=... en la URL de forma segura
    );
  }

  // --- ACCIONES SOBRE OFERTAS ---

  inscribirse(id: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.inscribirseOferta(id),
      {}, // Cuerpo vacío para el POST
   
    );
  }

  desapuntarse(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.desapuntarseOferta(id),
    
    );
  }

  // --- PERFIL Y TÍTULOS ---

  getTitulos(): Observable<ApiResponse<TituloDemandante[]>> {
    return this.http.get<ApiResponse<TituloDemandante[]>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.obtenerTitulos,
   
    );
  }
asociarTitulos(data: AgregarTituloRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.obtenerTitulos, // Según tu endpoint para POST
      data,
   
    );
  }

}