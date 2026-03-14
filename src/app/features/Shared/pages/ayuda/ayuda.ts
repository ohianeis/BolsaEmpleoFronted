import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth'; 
import { AyudaPasos } from './componentes/ayuda-pasos/ayuda-pasos';
import { AyudaPreguntas } from './componentes/ayuda-preguntas/ayuda-preguntas';
import { AyudaContacto } from './componentes/ayuda-contacto/ayuda-contacto';
import { RouterLink } from "@angular/router";

// Importamos los hijos que hemos creado

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [
    CommonModule,
    AyudaPasos,
    AyudaPreguntas,
    AyudaContacto,
    RouterLink
],
  templateUrl: './ayuda.html'
})
export class Ayuda implements OnInit {
  private authService = inject(AuthService);
  
  rolUsuario: string | null = null;

  // Configuración para Alumnos
 protected readonly pasosAlumno = [
  { 
    titulo: 'Tu Perfil es tu escaparate', 
    descripcion: 'Configura tus <strong>Títulos Oficiales</strong> para recibir ofertas que encajen contigo. Sin títulos, el sistema no podrá sugerirte empleos.',
    detalles: [
      '<strong>Visibilidad:</strong> Elige si quieres que tu dirección sea pública o privada.',
      '<strong>Estado Laboral:</strong> Configura si estás en "Búsqueda Activa" o "Desempleado".',
      '<strong>Vista Previa:</strong> Pulsa el botón para ver exactamente qué información ven las empresas de ti.',
      '<strong>Baja de cuenta:</strong> Puedes darte de baja si no tienes candidaturas activas. Para reingresar tras una baja, contacta con el centro antes de intentar un nuevo registro.'
    ],
    icono: 'pi-user-edit'
  },
  { 
    titulo: 'Busca y Filtra Ofertas', 
    descripcion: 'Encuentra vacantes relacionadas con tus estudios y revisa el <strong>Match de Afinidad</strong> para ver cuánto encajas.',
    detalles: [
      '<strong>Privacidad de Empresa:</strong> Algunas ofertas son anónimas; no verás el nombre ni la dirección hasta avanzar en el proceso.',
      '<strong>Detalle Desplegable:</strong> Pulsa en cada oferta para ver la información completa antes de inscribirte.'
    ],
    icono: 'pi-search'
  },
  { 
    titulo: 'Gestión de Candidaturas', 
    descripcion: 'Controla el estado de tus procesos desde una página centralizada.',
    detalles: [
      '<strong>Estados:</strong> Activa (en proceso), Conseguida (¡puesto tuyo!), Finalizada o Retirada.',
      '<strong>Retirar e Inscribir:</strong> Si retiras una candidatura, puedes volver a inscribirte desde la sección "Retiradas" sin buscar la oferta de nuevo.',
      '<strong>Inscripciones directas:</strong> Si una empresa te inscribe ella misma, lo verás reflejado en tu inicio.'
    ],
    icono: 'pi-list'
  }
];

  // Configuración para Empresas
 protected readonly pasosEmpresa = [
  { 
    titulo: 'Gestión Inteligente de Ofertas', 
    descripcion: 'Configura tus ofertas por <strong>Familia Profesional</strong> o títulos específicos. Los alumnos de esa familia verán tu oferta automáticamente.',
    detalles: [
      '<strong>Modo Anónimo:</strong> Oculta tu nombre y dirección si así lo deseas, puedes cambiar esto desde la oferta.',
      '<strong>Edición Restringida:</strong> Puedes editar la oferta siempre que no tenga candidatos inscritos, en ese caso no podras editar la familia ni los títulos.'
    ],
    icono: 'pi-briefcase'
  },
  { 
    titulo: 'Candidatos y Sugerencias', 
    descripcion: 'No esperes a que se apunten. El sistema te sugiere alumnos que encajan con tu perfil buscado.',
    detalles: [
      '<strong>Sugeridos:</strong> Puedes invitar proactivamente a alumnos que no se han inscrito.',
      '<strong>Procesos y Notas:</strong> Gestiona estados de selección y añade notas privadas de reclutador.'
    ],
    icono: 'pi-users'
  },
  { 
    titulo: 'Cierre y Adjudicación', 
    descripcion: 'Al asignar el último puesto disponible, la oferta se cerrará automáticamente.',
    detalles: [
      '<strong>Múltiples vacantes:</strong> La oferta sigue abierta hasta cubrir todos los puestos.',
      '<strong>Motivos de cierre:</strong> Puedes cerrar ofertas manualmente indicando el motivo.'
    ],
    icono: 'pi-check-circle'
  },
  { 
    titulo: 'Panel de Control y Perfil', 
    descripcion: 'Tu Dashboard te avisa de nuevos inscritos en tiempo real para una gestión rápida.',
    detalles: [
      '<strong>Baja de empresa:</strong> Solo permitida si no tienes ofertas activas. Si deseas reingresar contacta con el centro antes de intentar un nuevo registro.',
      '<strong>Optimización:</strong> Mantén tu perfil actualizado para atraer mejor talento.'
    ],
    icono: 'pi-chart-bar'
  }
];

  ngOnInit() {
    // Escuchamos el rol desde tu servicio de Laravel
    this.authService.getRolActual().subscribe(rol => {
      this.rolUsuario = rol;
    });
  }
}