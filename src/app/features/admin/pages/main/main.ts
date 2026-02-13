import { Component, OnInit, inject } from '@angular/core';
import { forkJoin, timer, zip, throwError,TimeoutError } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { AdminService } from '../../../../services/Admin/AdminService';
import {
  EmpresaInforme,
  OfertaInforme,
  ReporteEmpresaInactiva,
  ReporteOferta,
  TitulosEstadoInforme,
} from '../../../../api/models/Admin/informesModule';
import { ChartModule } from 'primeng/chart'; // Para el gráfico de Donuts/Líneas
import { TagModule } from 'primeng/tag'; // Para etiquetas de estado
import { ButtonModule } from 'primeng/button'; // Para el botón de "Descargar Informe"
import { SkeletonModule } from 'primeng/skeleton'; // Para el efecto de carga inicial
import { ToastModule } from 'primeng/toast'; //  mostrar errores de APIuier
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DrawerModule } from 'primeng/drawer';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
@Component({
  selector: 'app-main',

  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    TagModule,
    ButtonModule,
    SkeletonModule,
    ToastModule,
    TableModule,
    DrawerModule,
    DialogModule,
    FormsModule,
    Select,
  ],
  providers: [MessageService],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main implements OnInit {
  loading:boolean=true;
  errorApi:boolean=false;
  private adminService = inject(AdminService);

  // Totales para las tarjetas (KPIs)
  totalAsignadas: number = 0;
  totalDemandantes: number = 0;
  totalEmpresas: number = 0;
  totalOfertasAbiertas: number = 0;
  empresasInactivas: EmpresaInforme[] = [];
  ofertasVacias: OfertaInforme[] = [];
  // Para empresas
  selectedEmpresa: EmpresaInforme | null = null;
  visibleEmpresaDrawer: boolean = false;

  // Para ofertas
  selectedOferta: OfertaInforme | null = null;
  visibleOfertaDialog: boolean = false;

  // Datos para el gráfico de PrimeNG
  chartData: any;
  chartOptions: any;
  //para la exportacion del excell
  tiposInformes = [
    { id: 'ALU_FULL', label: 'Alumnos: Expediente Completo' },
    { id: 'ALU_TITULACION', label: 'Alumnos: Por Nivel de Titulación' },
    { id: 'EMP_INACTIVAS', label: 'Empresas: Sin actividad reciente' },
    { id: 'OFE_VACIAS', label: 'Ofertas: Sin candidatos inscritos' },
    { id: 'OFE_EXITO', label: 'Ofertas: Histórico de contrataciones' },
    { id: 'OFE_HISTORICO', label: 'Ofertas: Estadísticas de postulación' },
    { id: 'BRECHA_TALENTO', label: 'Análisis: Demanda vs Oferta (Brecha)' },
    { id: 'LEAD_TIME', label: 'Análisis: Tiempos de Colocación (Eficiencia)' },
  ];
  informeSeleccionado: any = null;
  exportando: boolean = false;
  constructor(private messageService: MessageService) {}
  ngOnInit() {
    this.cargarEstadisticas();
  }

 cargarEstadisticas() {
  this.errorApi = false; 
  this.loading = true;

  // Creamos un observable con todas las peticiones
  const peticiones$ = forkJoin({
    asignadas: this.adminService.getOfertasAsignadas(),
    demandantes: this.adminService.getTotalDemandantes(),
    empresas: this.adminService.getTotalEmpresas(),
    ofertas: this.adminService.getOfertasAbiertas(),
    titulos: this.adminService.getTitulosEstado(),
    inactivas: this.adminService.getEmpresasSinOfertas(),
    vacias: this.adminService.getOfertasSinPostulantes()
  });

  // Usamos 'zip' para esperar AMBOS: las peticiones y un timer de 800ms
  // Zip emitirá solo cuando el LENTO de los dos termine.
  zip(peticiones$, timer(800)).pipe(

      map(([resultados, _]) => resultados),
      timeout({
        each: 7000,
        with: () => throwError(() => new Error('TIMEOUT'))
      }),
      catchError(err => {
        // En lugar de solo lanzar la excepción, marcamos el estado de error
        this.errorApi = true;
        this.loading = false;
        return throwError(() => err); // Seguimos lanzándolo por si queremos un log
      })
    ).subscribe({
    next: (res) => {
      // 1, 2, 3, 4: Totales
      this.totalAsignadas = res.asignadas.data ?? 0;
      this.totalDemandantes = res.demandantes.data ?? 0;
      this.totalEmpresas = res.empresas.data?.total ?? 0;
      this.totalOfertasAbiertas = res.ofertas.data?.total ?? 0;

      // 5: Gráfico
      if (res.titulos.data) {
        this.configurarGraficoTitulos(res.titulos.data);
      }

      // 6 y 7: Tablas
      if (res.inactivas.data) {
        this.empresasInactivas = res.inactivas.data.listado.slice(0, 5);
      }
      if (res.vacias.data) {
        this.ofertasVacias = res.vacias.data.listado.slice(0, 5);
      }

      // Finalizamos carga
      this.loading = false;
    },
    error: (err) => {
      this.loading = false;
      console.error('Error cargando panel:', err);
    }
  });
}

  configurarGraficoTitulos(datos: TitulosEstadoInforme) {
    this.chartData = {
      labels: ['Activos', 'Extinguidos'],
      datasets: [
        {
          data: [datos.totalActivos, datos.totalInactivos],
          backgroundColor: ['#10b981', '#64748b'],
          hoverBackgroundColor: ['#059669', '#475569'],
        },
      ],
    };
  }
  // Métodos para abrir los detalles
  // Actualizamos para que sea "bajo demanda"
  verDetalleEmpresa(empresaSimple: any) {
    // Mostramos un esqueleto o cargador si quieres, pero llamamos a la API
    this.adminService.getDetalleEmpresa(empresaSimple.id).subscribe((res) => {
      if (res.data) {
        this.selectedEmpresa = res.data;
        this.visibleEmpresaDrawer = true;
      }
    });
  }

  // En tu Main.ts

  verDetalleOferta(ofertaSimple: any) {
    // 1. Obtenemos el ID del objeto que viene de la tabla
    const id = ofertaSimple.id;
    if (!id) return;

    // 2. Limpiamos la selección anterior para evitar "efecto fantasma"
    this.selectedOferta = null;

    // 3. Llamamos al nuevo endpoint de administración
    this.adminService.getDetalleOfertaAdmin(id).subscribe({
      next: (res) => {
        if (res.data) {
          this.selectedOferta = res.data;
          this.visibleOfertaDialog = true; // Aquí abrimos el Drawer/Dialog
        }
      },
      error: (err) => {
        console.error('Error al cargar la oferta:', err);
        // Opcional: mostrar un toast de error aquí
      },
    });
  }
  // En tu Main.ts
  formatearUrl(url: string | undefined): string {
    if (!url) return '#';
    // Si no empieza por http:// o https://, se lo añadimos
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  }
  // informes.ts
  generarInforme() {
    if (!this.informeSeleccionado) return;

    this.exportando = true;
    const tipo = this.informeSeleccionado.id;
    console.log('--- Iniciando exportación de:', tipo, '---');

    this.adminService.getReportesEspeciales<any>(tipo).subscribe({
      next: (res) => {
        console.log('1. Datos recibidos de API:', res.data);

        if (res.data && res.data.length > 0) {
          let dataMapeada: any[] = [];

          switch (tipo) {
            case 'ALU_FULL':
              dataMapeada = res.data.map((a: any) => ({
                'Nombre Completo': a.nombre,
                Email: a.email,
                Teléfono: a.telefono || 'N/R',
                Titulaciones: Array.isArray(a.titulos) ? a.titulos.join(', ') : 'Sin títulos',
                'Fecha Registro': a.created_at,
              }));
              break;

            case 'ALU_TITULACION': // <-- AÑADIDO
              dataMapeada = res.data.map((a: any) => ({
                Alumno: a.alumno,
                'Nivel Titulación': a.nivel,
                'Título Principal': a.titulo,
              }));
              break;

            case 'EMP_INACTIVAS':
              dataMapeada = res.data.map((e: any) => ({
                'Nombre Empresa': e.nombre,
                CIF: e.cif || 'No consta',
                Email: e.user?.email || 'N/A',
                Ubicación: e.localidad || 'N/R',
                'Fecha Registro': e.created_at,
              }));
              break;

            case 'OFE_VACIAS':
              dataMapeada = res.data.map((o: any) => ({
                Puesto: o.nombre || 'N/A',
                Estado: 'ABIERTA',
                Empresa: o.empresa?.nombre,
                'Localidad Empresa': o.empresa?.localidad,
                'Fecha Publicación': o.created_at,
              }));
              break;

            case 'OFE_HISTORICO': // CORREGIDO: Usamos demandantes_count
              dataMapeada = res.data.map((o: any) => ({
                Oferta: o.nombre,
                Empresa: o.empresa?.nombre,
                'Candidatos Inscritos': o.demandantes_count || 0, // Laravel envía {relacion}_count
                'Fecha Creación': o.created_at,
              }));
              break;

            case 'OFE_EXITO': // <-- AÑADIDO
              dataMapeada = res.data.map((o: any) => ({
                Oferta: o.nombre,
                Empresa: o.empresa,
                Contrataciones: o.contrataciones || 0,
                ESTADO: o.estado,
                'ADJUDICADO A': o.adjudicado_a,
                'FECHA FINALIZACIÓN': o.fecha_cierre,
              }));
              break;
            case 'BRECHA_TALENTO':
              dataMapeada = res.data.map((item: any) => ({
                'FAMILIA PROFESIONAL / TÍTULO': item.titulo,
                'ALUMNOS DISPONIBLES': item.alumnos,
                'OFERTAS PUBLICADAS': item.ofertas,
                'DIFERENCIA (BRECHA)': item.diferencia,
              }));
              break;
            case 'LEAD_TIME':
              dataMapeada = res.data.map((o: any) => ({
                OFERTA: o.oferta,
                EMPRESA: o.empresa,
                'PUBLICADA EL': o.fecha_publicacion,
                'ADJUDICADA EL': o.fecha_adjudicacion,
                'DÍAS PROCESO': o.dias_transcurridos,
                EFICIENCIA: o.eficiencia, //
              }));
              break;
            default:
              dataMapeada = res.data;
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Descarga iniciada',
            detail: String(res.message || 'Informe generado con éxito'),
            life: 3000,
          });

          console.log('2. Mapeo finalizado. Filas a escribir:', dataMapeada.length);

          // Ejecutamos la descarga
          this.descargarArchivoExcel(dataMapeada, tipo);
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Informe vacío',
            detail:
              String(res.message) ||
              'No se han encontrado registros para los criterios seleccionados.',
            life: 5000,
          });
        }
        this.exportando = false;
      },
      error: (err) => {
        console.error('Error crítico al conectar con la API:', err);
        this.exportando = false;
      },
    });
  }

  // Método auxiliar para procesar el archivo
  async descargarArchivoExcel(data: any[], tipo: string) {
    //cargo las librerias cuando se hace consulta para no hacer muy pesada la pagina
    const ExcelJS = await import('exceljs');
    const saveAs = (await import('file-saver')).saveAs;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    // 1. TÍTULO PRINCIPAL (Fila 1)
    const nombreInforme = this.tiposInformes.find((t) => t.id === tipo)?.label || 'Reporte';
    const headerKeys = Object.keys(data[0]);
    const ultimaLetra = String.fromCharCode(64 + headerKeys.length);

    worksheet.mergeCells(`A1:${ultimaLetra}1`);
    const titleCell = worksheet.getCell('A1');
    titleCell.value = nombreInforme.toUpperCase();
    titleCell.font = { size: 16, bold: true, color: { argb: 'FF334155' } };
    titleCell.alignment = { horizontal: 'center' };
    worksheet.getRow(1).height = 35;

    // 2. BLOQUE DE RESUMEN (Filas 2 a 5 aprox)

    // Lógica de datos para el resumen
    let resumenData: [string, any][] = [];
    let descripcion = ''; // Variable para el texto descriptivo

    switch (tipo) {
      case 'OFE_EXITO':
        descripcion =
          'Este informe analiza las ofertas cerradas que han resultado en una contratación efectiva, identificando a los alumnos seleccionados y el éxito de colocación por empresa.';
        resumenData = [
          ['Total Contrataciones', data.reduce((acc, c) => acc + (c['Nº CONTRATOS'] || 0), 0)],
          [
            'Eficiencia de Colocación',
            ((data.filter((i) => i['ESTADO'] === 'ADJUDICADA').length / data.length) * 100).toFixed(
              1,
            ) + '%',
          ],
          ['Fecha Informe Generado', new Date().toLocaleDateString()],
        ];
        break;

      case 'BRECHA_TALENTO':
        descripcion =
          'Estudio comparativo entre la demanda de las empresas (ofertas) y la disponibilidad de perfiles (alumnos) según su ciclo formativo para detectar necesidades de formación.';
        resumenData = [
          ['Total Alumnos en Bolsa', data.reduce((acc, c) => acc + c['ALUMNOS DISPONIBLES'], 0)],
          [
            'Total Ofertas Registradas',
            data.reduce((acc, c) => acc + c['OFERTAS RELACIONADAS'], 0),
          ],
          ['Sectores Analizados', data.length],
        ];
        break;

      case 'LEAD_TIME':
        descripcion =
          'Mide el tiempo transcurrido desde la publicación de una oferta hasta su adjudicación final, evaluando la agilidad del centro en la cobertura de vacantes.';
        const avg = data.reduce((acc, c) => acc + c['DÍAS PROCESO'], 0) / data.length;
        resumenData = [
          ['Tiempo Medio de Respuesta', avg.toFixed(1) + ' días'],
          ['Nivel de Servicio', avg <= 10 ? 'EXCELENTE' : 'A MEJORAR'],
          ['Total de Ofertas', data.length],
        ];
        break;

      case 'ALU_FULL':
        descripcion =
          'Listado detallado de alumnos validados en el sistema con su información de contacto y titulaciones académicas obtenidas.';
        resumenData = [
          ['Registros totales', data.length],
          ['Fecha', new Date().toLocaleDateString()],
        ];
        break;

      default:
        descripcion = 'Informe general de registros extraído de la plataforma de Bolsa de Empleo.';
        resumenData = [
          ['Registros totales', data.length],
          ['Fecha', new Date().toLocaleDateString()],
        ];
    }

    worksheet.mergeCells(`A2:${ultimaLetra}2`);
    const descCell = worksheet.getCell('A2');
    descCell.value = descripcion;
    descCell.font = { italic: true, size: 10, color: { argb: 'FF64748B' } }; // Gris azulado elegante
    descCell.alignment = { wrapText: true, vertical: 'middle' };
    worksheet.getRow(2).height = 30; // Un poco más de altura para que quepa el texto

    // RESUMEN EJECUTIVO (Ahora empieza en la A4 para dejar un espacio)
    worksheet.getCell('A4').value = 'RESUMEN EJECUTIVO';
    worksheet.getCell('A4').font = { bold: true, color: { argb: 'FF10B981' } };

    // Ajustamos el bucle del resumen para que empiece un poco más abajo
    resumenData.forEach((row, index) => {
      const r = worksheet.getRow(5 + index); // Fila 5 en adelante
      r.getCell(1).value = row[0] + ':';
      r.getCell(1).font = { bold: true };
      r.getCell(2).value = row[1];
    });

    // 3. CABECERAS DE TABLA (Empiezan en la fila 7 para dejar aire)
    const filaTabla = 9;
    worksheet.getRow(filaTabla).values = headerKeys.map((k) => k.toUpperCase());
    const headerRow = worksheet.getRow(filaTabla);
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    });

    // 4. DATOS
    data.forEach((item, index) => {
      const row = worksheet.addRow(Object.values(item));
      if (index % 2 !== 0) {
        row.eachCell(
          (c) => (c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }),
        );
      }
      // Colores condicionales según el tipo
      if (item['ESTADO'] === 'ADJUDICADA')
        row.getCell(headerKeys.indexOf('ESTADO') + 1).font = {
          color: { argb: 'FF059669' },
          bold: true,
        };
      if (item['EFICIENCIA'] === 'ALTA')
        row.getCell(headerKeys.indexOf('EFICIENCIA') + 1).font = {
          color: { argb: 'FF059669' },
          bold: true,
        };
    });

    // 5. AJUSTES FINALES
    worksheet.columns.forEach((col) => (col.width = 20));

    // 6. DESCARGA
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `CIP_Burlada_${tipo}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }
}
