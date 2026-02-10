import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Importamos tus constantes
import { ApiResponse } from '../../api/models/apiResponse';
import { API_ENDPOINTS_USO_CENTRO } from '../../api/apiEndpoints';
import { AlumnoExpediente, AlumnoListado, EmpresaListado, TituloAdmin, TituloRequest, UsuarioPendiente } from '../../api/models/Admin/adminModel';


import { Nivel } from '../Titulos/titulos';
import { EmpresaInforme, InformeDetallado, OfertaInforme, TitulosEstadoInforme } from '../../api/models/Admin/informesModule';
import { Oferta } from '../../api/models/Ofertas/ofertasResponse';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  /**
   * Headers con el Token Bearer
   */
  private getHeaders() {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Obtiene la lista de usuarios pendientes (validado = 0)
   * Usa: listadoValidacions
   */
 // GET: Lista de pendientes
  getUsuariosPendientes(): Observable<ApiResponse<UsuarioPendiente[]>> {
    return this.http.get<ApiResponse<UsuarioPendiente[]>>(
      API_ENDPOINTS_USO_CENTRO.centro.listadoValidacions,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Valida al usuario (PATCH) - Lo registra como Empresa o Demandante
   * Usa: siValidar
   */
// PATCH: Validar
  validarUsuario(idUsuario: number): Observable<ApiResponse<UsuarioPendiente>> {
    return this.http.patch<ApiResponse<UsuarioPendiente>>(
      API_ENDPOINTS_USO_CENTRO.centro.siValidar(idUsuario),
      {},
      { headers: this.getHeaders() }
    );
  }

  /**
   * Rechaza la validación (DELETE) - Elimina el registro del usuario
   * Usa: noValidar
   */
rechazarUsuario(idUsuario: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      API_ENDPOINTS_USO_CENTRO.centro.noValidar(idUsuario),
      { headers: this.getHeaders() }
    );
  }


  //servicios para los titulos
  // 1. Listar todos los títulos
getTitulos(): Observable<ApiResponse<TituloAdmin[]>> {
  return this.http.get<ApiResponse<TituloAdmin[]>>(
    API_ENDPOINTS_USO_CENTRO.centro.obtenerTodosTitulos,
    { headers: this.getHeaders() }
  );
}

// 2. Obtener niveles para el formulario
getNiveles(): Observable<ApiResponse<Nivel[]>> {
  return this.http.get<ApiResponse<Nivel[]>>(
    API_ENDPOINTS_USO_CENTRO.centro.obtenerNivelesTitulo,
    { headers: this.getHeaders() }
  );
}

// 3. Crear nuevo título
crearTitulo(datos: TituloRequest): Observable<ApiResponse<string>> {
  return this.http.post<ApiResponse<string>>(
    API_ENDPOINTS_USO_CENTRO.centro.crearTitulo,
    datos,
    { headers: this.getHeaders() }
  );
}

// 4. Actualizar título existente
actualizarTitulo(id: number, datos: TituloRequest): Observable<ApiResponse<any>> {
  return this.http.patch<ApiResponse<any>>(
    API_ENDPOINTS_USO_CENTRO.centro.actualizarTitulo(id),
    datos,
    { headers: this.getHeaders() }
  );
}

// 5. Eliminar (o desactivar) título
eliminarTitulo(id: number): Observable<ApiResponse<string>> {
  return this.http.delete<ApiResponse<string>>(
    API_ENDPOINTS_USO_CENTRO.centro.eliminarTitulo(id),
    { headers: this.getHeaders() }
  );
}
///métodos para datos api informes
// 1. Ofertas Asignadas (Éxito de inserción)
getOfertasAsignadas(): Observable<ApiResponse<number>> {
  return this.http.get<ApiResponse<number>>(
    API_ENDPOINTS_USO_CENTRO.centro.ofertasAsignadas,
    { headers: this.getHeaders() }
  );
}

// 2. Ofertas Abiertas (Actividad actual)
getOfertasAbiertas(): Observable<ApiResponse<InformeDetallado<OfertaInforme>>> {
  return this.http.get<ApiResponse<InformeDetallado<OfertaInforme>>>(
    API_ENDPOINTS_USO_CENTRO.centro.ofertasAbiertas,
    { headers: this.getHeaders() }
  );
}

// 3. Ofertas Cerradas (Histórico)
getOfertasCerradas(): Observable<ApiResponse<InformeDetallado<OfertaInforme>>> {
  return this.http.get<ApiResponse<InformeDetallado<OfertaInforme>>>(
    API_ENDPOINTS_USO_CENTRO.centro.ofertasCerradas,
    { headers: this.getHeaders() }
  );
}

// 4. Total Demandantes
getTotalDemandantes(): Observable<ApiResponse<number>> {
  return this.http.get<ApiResponse<number>>(
    API_ENDPOINTS_USO_CENTRO.centro.totalDemandantes,
    { headers: this.getHeaders() }
  );
}

// 5. Total Empresas y listado
getTotalEmpresas(): Observable<ApiResponse<InformeDetallado<EmpresaInforme>>> {
  return this.http.get<ApiResponse<InformeDetallado<EmpresaInforme>>>(
    API_ENDPOINTS_USO_CENTRO.centro.totalEmpresas,
    { headers: this.getHeaders() }
  );
}
// 6. Estado de los Títulos (Gráfico de donut)
getTitulosEstado(): Observable<ApiResponse<TitulosEstadoInforme>> {
  return this.http.get<ApiResponse<TitulosEstadoInforme>>(
    API_ENDPOINTS_USO_CENTRO.centro.titulosEstado,
    { headers: this.getHeaders() }
  );
}

// 7. Empresas que no han publicado nada
getEmpresasSinOfertas(): Observable<ApiResponse<InformeDetallado<EmpresaInforme>>> {
  return this.http.get<ApiResponse<InformeDetallado<EmpresaInforme>>>(
    API_ENDPOINTS_USO_CENTRO.centro.empresasSinOfertas,
    { headers: this.getHeaders() }
  );
}

// 8. Ofertas que no tienen candidatos
getOfertasSinPostulantes(): Observable<ApiResponse<InformeDetallado<OfertaInforme>>> {
  return this.http.get<ApiResponse<InformeDetallado<OfertaInforme>>>(
    API_ENDPOINTS_USO_CENTRO.centro.ofertasSinPostulantes,
    { headers: this.getHeaders() }
  );
}
getDetalleEmpresa(id: number): Observable<ApiResponse<EmpresaInforme>> {
  return this.http.get<ApiResponse<EmpresaInforme>>(
API_ENDPOINTS_USO_CENTRO.centro.detalleEmpresa(id),
    { headers: this.getHeaders() }
  );
}
getDetalleAlumno(id: number): Observable<ApiResponse<AlumnoExpediente>> {
  return this.http.get<ApiResponse<any>>(
    API_ENDPOINTS_USO_CENTRO.centro.detalleAlumnoAdmin(id),
    { headers: this.getHeaders() }
  );
}
getDetalleOfertaAdmin(id: number): Observable<ApiResponse<OfertaInforme>> {
  return this.http.get<ApiResponse<OfertaInforme>>(
    API_ENDPOINTS_USO_CENTRO.centro.detalleOfertaAdmin(id),
    { headers: this.getHeaders() }
  );
}
//obtener todos los alumnos y todas las empresa para gestion por parte admin
// En tu AdminService

/**
 * Recupera el listado completo de demandantes/alumnos para gestión
 */
getAllAlumnos(): Observable<ApiResponse<AlumnoListado[]>> {
  return this.http.get<ApiResponse<any[]>>(
    API_ENDPOINTS_USO_CENTRO.centro.todosAlumnos,
    { headers: this.getHeaders() }
  );
}

/**
 * Recupera el listado completo de empresas para gestión
 */
getAllEmpresas(): Observable<ApiResponse<EmpresaListado[]>> {
  return this.http.get<ApiResponse<any[]>>(
    API_ENDPOINTS_USO_CENTRO.centro.todasEmpresas,
    { headers: this.getHeaders() }
  );
}
/**obrtener datos para excell */
// AdminService.ts
getReportesEspeciales<T>(tipo: string): Observable<ApiResponse<T[]>> {
  const url = API_ENDPOINTS_USO_CENTRO.centro.reportesEspeciales(tipo);
  return this.http.get<ApiResponse<T[]>>(url, { headers: this.getHeaders() });
}
}