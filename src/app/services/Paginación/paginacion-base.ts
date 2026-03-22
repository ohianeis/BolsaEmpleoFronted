import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiPaginatedResponse } from '../../api/models/apiResponse';

export abstract class PaginacionBase {
  constructor(protected http: HttpClient) {}

  // Centralizamos la construcción de la URL con parámetros
 protected getPaginated<T>(
    url: string, 
    page: number, 
    rows: number, 
    extraParams: { [key: string]: any } = {} // Un objeto para todo lo extra
  ): Observable<ApiPaginatedResponse<T>> {
    
    // Configuramos los básicos
    let params = new HttpParams()
      .set('page', (page + 1).toString()) 
      .set('rows', rows.toString());

    // Recorremos el objeto extra y añadimos lo que venga (busqueda, estado, etc.)
    Object.keys(extraParams).forEach(key => {
      const value = extraParams[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ApiPaginatedResponse<T>>(url, { params });
  }
}
