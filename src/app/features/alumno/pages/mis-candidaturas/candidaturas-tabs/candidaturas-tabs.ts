import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-candidaturas-tabs',
  imports: [CommonModule,TabsModule,Tag],
  templateUrl: './candidaturas-tabs.html',
  styleUrl: './candidaturas-tabs.css',
})
export class CandidaturasTabs {
@Input() tabActual: string = 'activas';
  @Input() totales = { activas: 0, conseguidas: 0, retiradas: 0, finalizadas: 0 };
  @Output() onTabChange = new EventEmitter<string>();
  handleTabChange(event: any) {
    const valor = event?.toString() || 'activas';
    this.onTabChange.emit(valor);
  }
}
