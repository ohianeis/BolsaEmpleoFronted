import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-ofertas-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  template: `
    @for (i of items; track $index) {
      <div class="bg-white border border-slate-100 rounded-[2.5rem] p-6 flex gap-6 shadow-sm mb-4 animate-pulse">
        <p-skeleton shape="circle" size="4rem"></p-skeleton>
        <div class="flex-1">
          <p-skeleton width="40%" styleClass="mb-3" height="1.5rem"></p-skeleton>
          <p-skeleton width="90%" height="2rem"></p-skeleton>
        </div>
      </div>
    }
  `
})
export class OfertasSkeleton {
  @Input() count: number = 3;
  get items() { return Array(this.count).fill(0); }
}