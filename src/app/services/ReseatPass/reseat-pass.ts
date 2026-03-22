import { ChangePass } from './../../features/auth/pages/change-pass/change-pass';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../api/models/apiResponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_ENDPOINTS_AUTH, API_ENDPOINTS_USO_CENTRO } from '../../api/apiEndpoints';
import { ChangePassUserData, ResetPassAdminData } from '../../api/models/ReseatPass/reseatPass';

@Injectable({
  providedIn: 'root',
})
export class ReseatPass {
  private http=inject(HttpClient);

  resetPasswordAdmin(idUsuario: number): Observable<ApiResponse<ResetPassAdminData>> {
  return this.http.post<ApiResponse<any>>(
    API_ENDPOINTS_USO_CENTRO.centro.resetearPass(idUsuario),
    {},
  );
}

/**
 * [USUARIO/COMÚN] Permite al usuario cambiar su propia contraseña (especialmente tras un reset).
 * Endpoint: /api/change-password-user
 */
cambiarPasswordPropia(payload: { password: string; password_confirmation: string }): Observable<ApiResponse<ChangePassUserData>> {
  // Nota: Usamos API_ENDPOINTS_AUTH porque esta ruta suele estar en el bloque de autenticación
  return this.http.post<ApiResponse<any>>(
    API_ENDPOINTS_AUTH.auth.cambiarPass,
    payload,
  );
}
}
