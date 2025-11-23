import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../api/apiModules';
import { API_ENDPOINTS_AUTH } from '../api/apiEndpoints';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private http:HttpClient){}

  login(datos:{email:string, password:string}){
    return this.http.post<Login>(API_ENDPOINTS_AUTH.auth.login,datos);
  }
}
