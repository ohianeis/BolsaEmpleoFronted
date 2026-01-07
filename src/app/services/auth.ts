import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Login } from '../api/models/apiModules';
import { API_ENDPOINTS_AUTH } from '../api/apiEndpoints';
import apiService from '../api/apiService';
import { ApiResponse } from '../api/models/apiResponse';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private http:HttpClient){}

 login(datos: { email: string, password: string }): Observable<ApiResponse<Login>> {
  return this.http.post<any>(API_ENDPOINTS_AUTH.auth.login, datos).pipe(
    map(res => {
      // Caso Éxito (200)
      this.saveSession(res); // Función auxiliar para guardar token/rol
      return { success: true, message: 'Bienvenido', data: res };
    }),
    catchError(err => {
      // Caso Error (401, 422, etc.)
      // Extraemos el mensaje de la respuesta de Laravel que pusiste en la foto
      const errorMessage = err.error?.mensaje || err.error?.message || 'Error desconocido';
      
      return of({ 
        success: false, 
        message: errorMessage, 
        errors: err.error?.errors // Aquí pillamos los fallos de email/password del 422
      });
    })
  );
}
  private  saveSession(res:Login):void{
      //guardar token
      sessionStorage.setItem("token",res.token);
      //guardo rol
      sessionStorage.setItem("rol",res.rol)
      //guardo nombre
      sessionStorage.setItem("name",res.usuario);
    }
}
