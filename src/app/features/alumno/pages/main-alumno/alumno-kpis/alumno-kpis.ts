import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-alumno-kpis',
imports: [CommonModule],
  templateUrl: './alumno-kpis.html',
  styleUrl: './alumno-kpis.css',
})
export class AlumnoKpis implements OnChanges {
  @Input() data: { inscripciones: number; titulos: number; ofertas: number } | undefined;
  
  // Variables locales para la animación
  displayStats = { inscripciones: 0, titulos: 0, ofertas: 0 };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.animateCount(this.data.inscripciones, 'inscripciones');
      this.animateCount(this.data.titulos, 'titulos');
      this.animateCount(this.data.ofertas, 'ofertas');
    }
  }

  private animateCount(target: number, key: keyof typeof this.displayStats) {
    let start = 0;
    const duration = 800;
    if (target <= 0) {
        this.displayStats[key] = 0;
        return;
    }
    const stepTime = Math.max(duration / target, 30);
    const timer = setInterval(() => {
      start++;
      this.displayStats[key] = start;
      if (start >= target) clearInterval(timer);
    }, stepTime);
  }
}
