import { API_ENDPOINTS_USO_EMPRESA } from './../../api/apiEndpoints';
import { ApiResponse } from './../../api/models/apiResponse';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CandidatoCompleto, CandidatoElegible, CandidatoResumen, EstadoCandidato, Oferta, OfertaDetalle, RegistrarOfertaRequest, RegistrarOfertaResponse, StatsEmpresa } from '../../api/models/Ofertas/ofertasResponse';
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
  crearOferta(datosOferta: RegistrarOfertaRequest): Observable<ApiResponse<RegistrarOfertaResponse>> {
    return this.http.post<ApiResponse<any>>(
      API_ENDPOINTS_USO_EMPRESA.empresa.registrarOferta, 
      datosOferta,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Obtiene el detalle de una oferta específica
   */
  getDetalleOferta(id: number): Observable<ApiResponse<OfertaDetalle>> {
    return this.http.get<ApiResponse<OfertaDetalle>>(
      API_ENDPOINTS_USO_EMPRESA.empresa.detalleOferta(id),
      { headers: this.getHeaders() }
    );
  }
  // Para ver quién se ha apuntado a una oferta
  getCandidatosInscritos(idOferta: number): Observable<ApiResponse<CandidatoResumen[]>> {
    return this.http.get<ApiResponse<CandidatoResumen[]>>(
      API_ENDPOINTS_USO_EMPRESA.empresa.todosCandidatosInscritos(idOferta),
      { headers: this.getHeaders() }
    );
  }
  //detalle general candidato inscrito
   getDetalleCandidato(idOferta: number, idCandidato:number): Observable<ApiResponse<CandidatoCompleto>> {
    return this.http.get<ApiResponse<CandidatoCompleto>>(
      API_ENDPOINTS_USO_EMPRESA.empresa.detalleDemandateInscrito(idOferta,idCandidato),
      { headers: this.getHeaders() }
    );
  }


  // 1. Obtener candidatos elegibles no inscritos
getNoInscritos(idOferta: number): Observable<CandidatoElegible[]> {
  return this.http.get<CandidatoElegible[]>(
    API_ENDPOINTS_USO_EMPRESA.empresa.demandatesNoInscritos(idOferta),
    { headers: this.getHeaders() }
  );
}

// 2. Inscribir a un candidato manualmente
// Asumiendo que el endpoint es POST y recibe el ID del demandante
inscribirCandidato(idOferta: number, idDemandante: number): Observable<any> {
  return this.http.post(
   API_ENDPOINTS_USO_EMPRESA.empresa.añadirCandidatoOferta(idOferta,idDemandante),
    {}, // Body vacío si los IDs van por URL
    { headers: this.getHeaders() }
  );
}
//asignar una oferta de trabajo a un candidato
asignarCandidato(idOferta: number, idDemandante: number): Observable<any> {
  return this.http.patch(
   API_ENDPOINTS_USO_EMPRESA.empresa.asignarOferta(idOferta,idDemandante),
   {},
    { headers: this.getHeaders() }
  );
}
//cerrar oferta
cerrarOferta(idOferta: number): Observable<any> {
  // Enviamos el motivo en el body
  return this.http.patch(
       API_ENDPOINTS_USO_EMPRESA.empresa.cerrarOferta(idOferta),

 {},
    { headers: this.getHeaders() }
  );
}
actualizarSeguimiento(idOferta: number, idCandidato: number, datos: any): Observable<any> {
  return this.http.patch(
    API_ENDPOINTS_USO_EMPRESA.empresa.estadoCandidato(idOferta, idCandidato),
    datos, // <--- Aquí pasamos el objeto con los cambios
    { headers: this.getHeaders() }
  );
}

 getEstadosCandidato(): Observable<ApiResponse<EstadoCandidato[]>> {
  return this.http.get<any>(API_ENDPOINTS_USO_EMPRESA.empresa.seguimientoCandidato, { 
    headers: this.getHeaders() 
  }).pipe(
    map(response => {
      // Si la respuesta es un Array, la convertimos al formato ApiResponse
      if (Array.isArray(response)) {
        return {
          success: true,
          data: response,
          message: 'Cargado correctamente'
        } as ApiResponse<EstadoCandidato[]>;
      }
      // Si ya venía con el formato correcto, la devolvemos tal cual
      return response as ApiResponse<EstadoCandidato[]>;
    })
  );
}
//datos ofertas activas, candidatos nuevos, total cerradas para dashboard empresa
getStatsEmpresa(): Observable<ApiResponse<StatsEmpresa>> {
  return this.http.get<ApiResponse<StatsEmpresa>>(
    API_ENDPOINTS_USO_EMPRESA.empresa.stats, 
    { headers: this.getHeaders() }
  );
}
}