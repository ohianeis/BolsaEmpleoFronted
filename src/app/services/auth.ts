import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';
import { Login, UserProfileResponse } from '../api/models/apiModules';
import { API_ENDPOINTS_AUTH } from '../api/apiEndpoints';
import apiService from '../api/apiService';
import { ApiResponse } from '../api/models/apiResponse';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
 //variables en memoria para proteger mejor la api
 private userRole: string | null = null;
  private userName: string | null = null;
  constructor(private http:HttpClient){}
  // 1. Añadimos la función para sacar el token
  private getHeaders() {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  verDatos(){
    console.log(`userRole: ${this.userRole} y userName: ${this.userName}`);
  }

 login(datos: { email: string, password: string }): Observable<ApiResponse<Login>> {
   this.clearSession();
  return this.http.post<any>(API_ENDPOINTS_AUTH.auth.login, datos).pipe(
    map(res => {
      // Caso Éxito (200)
      this.saveSession(res); // Función auxiliar para guardar token/rol
      //comprobar el reseteo pass
      if (res.user?.change_pass === 1) {
        return { 
          success: true, 
          message: 'RESET_REQUIRED', // Enviamos un código especial
          data: res 
        };
      }
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
/**
   * Obtiene los roles (Empresa/Demandante) para el formulario de registro
   */
  getRoles(): Observable<ApiResponse<any[]>> {
    return this.http.get<any[]>(API_ENDPOINTS_AUTH.auth.roles).pipe(
      map(res => ({ success: true, data: res })),
      catchError(() => of({ success: false, message: 'No se pudieron cargar los roles', data: [] }))
    );
  }
  /**
   * Registra un nuevo usuario
   */
  registro(datos: any): Observable<ApiResponse<any>> {
    return this.http.post<any>(API_ENDPOINTS_AUTH.auth.registro, datos).pipe(
      map(res => {
        // Opcional: Podrías guardar la sesión aquí si quieres que entre logueado
        // Pero como tiene que esperar validación, quizás solo quieras avisar.
        return { success: true, message: 'Registro completado', data: res };
      }),
      catchError(err => {
        const errorMessage = err.error?.message || 'Error en el registro';
        return of({ 
          success: false, 
          message: errorMessage, 
          errors: err.error?.errors // Importante para mostrar "Email ya registrado"
        });
      })
    );
  }
  /**
   * Intenta obtener el rol. 
   * Prioridad: 1. Memoria -> 2. API (con Token) -> 3. Invitado
   */
getRolActual(): Observable<string> {
  // Si ya está en memoria (navegación normal)
  if (this.userRole) {
    return of(this.userRole);
  }

  //  Si NO hay memoria (pasó un F5), mirar si hay un token guardado
  const token = sessionStorage.getItem('token');
  
  if (!token) {
    console.warn('⚠️ No hay token tras el refresh, al login.');
    return of('invalido');
  }

  //RECONEXIÓN AUTOMÁTICA: 
  // Llamamos a la API para que diga quién es  dueño del token
  return this.http.get<UserProfileResponse>(API_ENDPOINTS_AUTH.auth.perfilAuth, { 
    headers: this.getHeaders() 
  }).pipe(
    map(res => {
      //  llenar los datos del servicio si coincide el rol manda api con el rol session
      this.userRole = res.rol; 
      this.userName = res.usuario;
      sessionStorage.setItem('rol', res.rol);//actualiza rol session x si se toco
      sessionStorage.setItem('change_pass', res.change_pass ? '1' : '0');
      console.log('🔄 Sesión restaurada tras refresh:', res.rol);
      return res.rol;
    }),
    catchError(() => {
      // Si el token era viejo o falso, limpiamos todo
      sessionStorage.removeItem('token');
       sessionStorage.removeItem('rol');
        sessionStorage.removeItem('name');
      return of('invalido');
    })
  );
}
  private  saveSession(res:Login):void{

    // Guardamo en memoria servicio
    this.userRole = res.rol;
    this.userName = res.usuario;
const reseatPass=String(res.change_pass);
    //guardo en sessionStorage
      //guardar token
      sessionStorage.setItem("token",res.token);
      //guardo rol
      sessionStorage.setItem("rol",res.rol)
      //guardo nombre
      sessionStorage.setItem("name",res.usuario);
      if (res.change_pass) {
    sessionStorage.setItem("change_pass", reseatPass);
  }
    }
    //logout y borrado datos en angular, tanto sessionStorage + datos aqui en servicio
  logout(): Observable<any> {
    // 1. Llamamos al endpoint de Laravel (requiere token en el header)
    return this.http.post(API_ENDPOINTS_AUTH.auth.logout, {}, { headers: this.getHeaders() }).pipe(
      finalize(() => {
        // 2. Pase lo que pase (éxito o error de red), limpiamos el navegador, finalize se ejecuta siempre aunque haya error 500
        this.clearSession();
        console.log('🚪 Sesión cerrada y storage limpio');
      })
    );
  }
  private clearSession(): void {
    // Limpia memoria
    this.userRole = null;
    this.userName = null;
    // Limpia storage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('rol');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('change_pass');
  }
}
