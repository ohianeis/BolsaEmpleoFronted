import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS_USO_DEMANDANTE } from '../../api/apiEndpoints';
import { ApiResponse } from '../../api/models/apiResponse';
import { DashboardStats } from '../../api/models/Demandantes/demantantesResponse';

@Injectable({
  providedIn: 'root',
})
export class Alumno {
private http=inject(HttpClient);
   // Función privada para obtener los headers con el token
  private getHeaders() {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.stats,
       { headers: this.getHeaders() }
    );
}
}
