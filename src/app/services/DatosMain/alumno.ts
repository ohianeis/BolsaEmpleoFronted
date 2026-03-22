import { HttpClient } from '@angular/common/http';
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
  
getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(
      API_ENDPOINTS_USO_DEMANDANTE.demandante.stats,
     
    );
}
}
