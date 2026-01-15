import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS_USO_COMUNES } from '../../api/apiEndpoints';

export interface Titulo {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class TitulosService {
  private url = API_ENDPOINTS_USO_COMUNES.perfil.titulosActivos;

  constructor(private http: HttpClient) {}

   private getHeaders() {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTitulosActivos(): Observable<Titulo[]> {
    return this.http.get<Titulo[]>(this.url, { headers: this.getHeaders() });
  }
 /* getOfertasEmpresa(): Observable<ApiResponse<Oferta[]>> {
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
  }*/
  
}