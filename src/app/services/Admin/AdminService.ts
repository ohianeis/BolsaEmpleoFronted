import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

// Importamos tus constantes
import { ApiPaginatedResponse, ApiResponse } from '../../api/models/apiResponse';
import { API_ENDPOINTS_USO_CENTRO } from '../../api/apiEndpoints';
import { AlumnoExpediente, AlumnoListado, EmpresaListado, Familia, FamiliaRequest, TituloAdmin, TituloRequest, UsuarioPendiente } from '../../api/models/Admin/adminModel';


import { Nivel } from '../Titulos/titulos';
import { EmpresaInforme, InformeDetallado, OfertaInforme, TitulosEstadoInforme } from '../../api/models/Admin/informesModule';
import { Oferta } from '../../api/models/Ofertas/ofertasResponse';
import { PaginacionBase } from '../Paginación/paginacion-base';


@Injectable({
  providedIn: 'root'
})
export class AdminService extends PaginacionBase{
  private pendientesSubject = new BehaviorSubject<number>(0);//suscribrime a cambios para conteo validaciones actulaizado
  pendientes$ = this.pendientesSubject.asObservable();
  constructor( http: HttpClient) {
    super(http);
   }
// Método para actualizar el valor desde cualquier parte de las validaciones
  actualizarContador(valor: number) {
    this.pendientesSubject.next(valor);
  }
  

  /**
   * Obtiene la lista de usuarios pendientes (validado = 0)
   * Usa: listadoValidacions
   */
 // GET: Lista de pendientes
 getUsuariosPendientes(page: number = 0, rows: number = 10, busqueda: string = ''): Observable<ApiPaginatedResponse<UsuarioPendiente>> {
    return this.getPaginated<UsuarioPendiente>(
      API_ENDPOINTS_USO_CENTRO.centro.listadoValidacions,
      page,
      rows,
      { busqueda }
    );
  }
/**Obtiene numero de validaciones pendientes */
getPendientesCount(): Observable<ApiResponse<number>> {
  return this.http.get<ApiResponse<number>>(
    API_ENDPOINTS_USO_CENTRO.centro.validacionesPendientes,
    
  ).pipe(
    tap(res => {
      if (res && res.data !== undefined) {
        this.actualizarContador(res.data);
      }
    })
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
    
    );
  }

  /**
   * Rechaza la validación (DELETE) - Elimina el registro del usuario
   * Usa: noValidar
   */
rechazarUsuario(idUsuario: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      API_ENDPOINTS_USO_CENTRO.centro.noValidar(idUsuario),
     
    );
  }


  //servicios para los titulos
  // 1. Listar todos los títulos
getTitulos(): Observable<ApiResponse<TituloAdmin[]>> {
  return this.http.get<ApiResponse<TituloAdmin[]>>(
    API_ENDPOINTS_USO_CENTRO.centro.obtenerTodosTitulos,
   
  );
}

// 2. Obtener niveles para el formulario
getNiveles(): Observable<ApiResponse<Nivel[]>> {
  return this.http.get<ApiResponse<Nivel[]>>(
    API_ENDPOINTS_USO_CENTRO.centro.obtenerNivelesTitulo,
  
  );
}

// 3. Crear nuevo título
crearTitulo(datos: TituloRequest): Observable<ApiResponse<string>> {
  return this.http.post<ApiResponse<string>>(
    API_ENDPOINTS_USO_CENTRO.centro.crearTitulo,
    datos,
    
  );
}

// 4. Actualizar título existente
actualizarTitulo(id: number, datos: TituloRequest): Observable<ApiResponse<any>> {
  return this.http.patch<ApiResponse<any>>(
    API_ENDPOINTS_USO_CENTRO.centro.actualizarTitulo(id),
    datos,
 
  );
}

// 5. Eliminar (o desactivar) título
eliminarTitulo(id: number): Observable<ApiResponse<string>> {
  return this.http.delete<ApiResponse<string>>(
    API_ENDPOINTS_USO_CENTRO.centro.eliminarTitulo(id),
   
  );
}

///metodos para manejar familias profesionales
/**
   * 1. Obtiene todas las familias (Activas para combos o todas para gestión)
   */
  getFamilias(): Observable<ApiResponse<Familia[]>> {
    return this.http.get<ApiResponse<Familia[]>>(
      API_ENDPOINTS_USO_CENTRO.centro.obtenerFamilias, // Asegúrate de definir esta ruta en tus constantes
     
    );
  }

  /**
   * 2. Crear una nueva familia profesional
   */
  crearFamilia(datos: FamiliaRequest): Observable<ApiResponse<Familia>> {
    return this.http.post<ApiResponse<Familia>>(
      API_ENDPOINTS_USO_CENTRO.centro.crearFamilia,
      datos,
     
    );
  }

  /**
   * 3. Actualizar nombre o estado de una familia
   */
  actualizarFamilia(id: number, datos: FamiliaRequest): Observable<ApiResponse<Familia>> {
    return this.http.patch<ApiResponse<Familia>>(
      API_ENDPOINTS_USO_CENTRO.centro.actualizarFamilia(id),
      datos,
    
    );
  }

  /**
   * 4. Desactivar familia (Borrado lógico)
   */
  eliminarFamilia(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      API_ENDPOINTS_USO_CENTRO.centro.eliminarFamilia(id),
    
    );
  }
///métodos para datos api informes
// 1. Ofertas Asignadas (Éxito de inserción)
getOfertasAsignadas(): Observable<ApiResponse<number>> {
  return this.http.get<ApiResponse<number>>(
    API_ENDPOINTS_USO_CENTRO.centro.ofertasAsignadas,
  
  );
}

// 2. Ofertas Abiertas (Actividad actual)
getOfertasAbiertas(): Observable<ApiResponse<InformeDetallado<OfertaInforme>>> {
  return this.http.get<ApiResponse<InformeDetallado<OfertaInforme>>>(
    API_ENDPOINTS_USO_CENTRO.centro.ofertasAbiertas,
    
  );
}

// 3. Ofertas Cerradas (Histórico)
getOfertasCerradas(): Observable<ApiResponse<InformeDetallado<OfertaInforme>>> {
  return this.http.get<ApiResponse<InformeDetallado<OfertaInforme>>>(
    API_ENDPOINTS_USO_CENTRO.centro.ofertasCerradas,
   
  );
}

// 4. Total Demandantes
getTotalDemandantes(): Observable<ApiResponse<number>> {
  return this.http.get<ApiResponse<number>>(
    API_ENDPOINTS_USO_CENTRO.centro.totalDemandantes,
  
  );
}

// 5. Total Empresas y listado
getTotalEmpresas(): Observable<ApiResponse<InformeDetallado<EmpresaInforme>>> {
  return this.http.get<ApiResponse<InformeDetallado<EmpresaInforme>>>(
    API_ENDPOINTS_USO_CENTRO.centro.totalEmpresas,
   
  );
}
// 6. Estado de los Títulos (Gráfico de donut)
getTitulosEstado(): Observable<ApiResponse<TitulosEstadoInforme>> {
  return this.http.get<ApiResponse<TitulosEstadoInforme>>(
    API_ENDPOINTS_USO_CENTRO.centro.titulosEstado,
   
  );
}

// 7. Empresas que no han publicado nada
getEmpresasSinOfertas(): Observable<ApiResponse<InformeDetallado<EmpresaInforme>>> {
  return this.http.get<ApiResponse<InformeDetallado<EmpresaInforme>>>(
    API_ENDPOINTS_USO_CENTRO.centro.empresasSinOfertas,
   
  );
}

// 8. Ofertas que no tienen candidatos
getOfertasSinPostulantes(): Observable<ApiResponse<InformeDetallado<OfertaInforme>>> {
  return this.http.get<ApiResponse<InformeDetallado<OfertaInforme>>>(
    API_ENDPOINTS_USO_CENTRO.centro.ofertasSinPostulantes,
   
  );
}
getDetalleEmpresa(id: number): Observable<ApiResponse<EmpresaInforme>> {
  return this.http.get<ApiResponse<EmpresaInforme>>(
API_ENDPOINTS_USO_CENTRO.centro.detalleEmpresa(id),
  
  );
}
getDetalleAlumno(id: number): Observable<ApiResponse<AlumnoExpediente>> {
  return this.http.get<ApiResponse<AlumnoExpediente>>(
    API_ENDPOINTS_USO_CENTRO.centro.detalleAlumnoAdmin(id),
   
  );
}
getDetalleOfertaAdmin(id: number): Observable<ApiResponse<OfertaInforme>> {
  return this.http.get<ApiResponse<OfertaInforme>>(
    API_ENDPOINTS_USO_CENTRO.centro.detalleOfertaAdmin(id),
   
  );
}
//obtener todos los alumnos y todas las empresa para gestion por parte admin
// En tu AdminService

/**
 * Recupera el listado completo de demandantes/alumnos para gestión
 */
getAllAlumnos(page: number = 0, rows: number = 10, busqueda: string = ''): Observable<ApiPaginatedResponse<AlumnoListado>> {
    return this.getPaginated<AlumnoListado>(
      API_ENDPOINTS_USO_CENTRO.centro.todosAlumnos,
      page,
      rows,
      { busqueda }
    );
  }

/**
 * Recupera el listado completo de empresas para gestión
 */
getAllEmpresas(page: number = 0, rows: number = 10, busqueda: string = ''): Observable<ApiPaginatedResponse<EmpresaListado>> {
    return this.getPaginated<EmpresaListado>(
      API_ENDPOINTS_USO_CENTRO.centro.todasEmpresas,
      page,
      rows,
      { busqueda }
    );
  }
/**obrtener datos para excell */
// AdminService.ts
getReportesEspeciales<T>(tipo: string): Observable<ApiResponse<T[]>> {
  const url = API_ENDPOINTS_USO_CENTRO.centro.reportesEspeciales(tipo);
  return this.http.get<ApiResponse<T[]>>(url);
}
}