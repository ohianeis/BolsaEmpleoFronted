import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

// Importamos tus interfaces

import { AdminService } from '../../../../../services/Admin/AdminService';
import { ReporteEmpresaInactiva, ReporteOferta } from '../../../../../api/models/Admin/informesModule';

interface TipoInforme {
  id: string;
  label: string;
}
@Component({
  selector: 'app-informes',
imports: [CommonModule, FormsModule, SelectModule, ButtonModule],  templateUrl: './informes.html',
  styleUrl: './informes.css',
})
export class Informes {
private adminService = inject(AdminService);
  private messageService = inject(MessageService);

  @Input() tiposInformes: TipoInforme[] = [
    { id: 'ALU_FULL', label: 'Alumnos: Expediente Completo' },
    { id: 'EMP_INACTIVAS', label: 'Empresas: Sin actividad reciente' },
    { id: 'OFE_VACIAS', label: 'Ofertas: Sin candidatos inscritos' },
    { id: 'OFE_HISTORICO', label: 'Ofertas: Estadísticas de postulación' },
    { id: 'BRECHA_TALENTO', label: 'Análisis: Demanda vs Oferta (Brecha)' },
  ];

  informeSeleccionado: TipoInforme | null = null;
  exportando = false;

  generarInforme(): void {
    if (!this.informeSeleccionado) return;

    this.exportando = true;
    const tipo = this.informeSeleccionado.id;

    // Usamos un tipo genérico base para la petición
    this.adminService.getReportesEspeciales<any[]>(tipo).subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          const dataMapeada = this.mapearDatosSegunInterfaz(res.data, tipo);
          this.descargarArchivoExcel(dataMapeada, tipo);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Excel generado correctamente' });
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Sin datos', detail: 'No hay registros para este periodo' });
        }
        this.exportando = false;
      },
      error: () => {
        this.exportando = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fallo al conectar con el servidor' });
      }
    });
  }

  /**
   * Mapeo estricto usando tus interfaces
   */
  private mapearDatosSegunInterfaz(data: any[], tipo: string): Record<string, any>[] {
    switch (tipo) {
      case 'EMP_INACTIVAS':
        // Tipamos la entrada como tu interfaz ReporteEmpresaInactiva
        return (data as ReporteEmpresaInactiva[]).map(e => ({
          'NOMBRE EMPRESA': e.nombre,
          'CIF': e.cif || 'No consta',
          'UBICACIÓN': e.localidad || 'N/R',
          'EMAIL CUENTA': e.user?.email || 'Sin email',
          'FECHA REGISTRO': e.created_at
        }));

      case 'OFE_VACIAS':
      case 'OFE_HISTORICO':
        // Tipamos la entrada como tu interfaz ReporteOferta
        return (data as ReporteOferta[]).map(o => ({
          'PUESTO': o.puesto,
          'ESTADO': o.estado,
          'EMPRESA': o.empresa?.nombre || 'N/A',
          'LOCALIDAD': o.empresa?.localidad || 'N/A',
          'CANDIDATOS': o.candidatos_count ?? 0,
          'FECHA PUBLICACIÓN': o.created_at
        }));

      case 'ALU_FULL':
        // Aquí podrías usar EmpresaInforme si la estructura es similar o crear ReporteAlumno
        return data.map(a => ({
          'ALUMNO': a.nombre,
          'EMAIL': a.email,
          'TELÉFONO': a.telefono || 'N/R',
          'FECHA': a.created_at
        }));

      default:
        return data;
    }
  }

  private async descargarArchivoExcel(data: Record<string, any>[], tipo: string): Promise<void> {
    const ExcelJS = await import('exceljs');
    const saveAs = (await import('file-saver')).saveAs;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Oficial');

    // Estilos de cabecera (Verde Admin)
    const headers = Object.keys(data[0]);
    const headerRow = worksheet.addRow(headers);
    
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } }; // Verde Esmeralda
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center' };
    });

    // Añadir datos
    data.forEach(item => {
      worksheet.addRow(Object.values(item));
    });

    // Ajuste de columnas
    worksheet.columns.forEach(col => col.width = 25);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `CIP_Burlada_${tipo}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }
}
