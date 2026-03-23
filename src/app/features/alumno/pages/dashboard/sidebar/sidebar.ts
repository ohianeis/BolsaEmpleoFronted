import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-sidebar',
imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
@Output() onItemClick = new EventEmitter<void>();

  closeMenu() {
    this.onItemClick.emit();
  }
}
