import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiPaginatedResponse } from '../../api/models/apiResponse';

export abstract class PaginacionBase {
  constructor(protected http: HttpClient) {}

  // Centralizamos la construcción de la URL con parámetros
  protected getPaginated<T>(
    url: string, 
    page: number, 
    perPage: number, 
    headers: HttpHeaders // Los pasamos desde el servicio hijo
  ): Observable<ApiPaginatedResponse<T>> {
    
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<ApiPaginatedResponse<T>>(url, {
      headers: headers,
      params: params
    });
  }
}
