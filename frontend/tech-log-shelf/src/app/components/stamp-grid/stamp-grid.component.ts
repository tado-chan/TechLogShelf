import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimalStamp } from '../../stores/app.store';

@Component({
  selector: 'app-stamp-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stamp-grid.component.html',
  styleUrl: './stamp-grid.component.css'
})
export class StampGridComponent {
  @Input() stampGrid: (AnimalStamp | null)[][] = [];
  @Input() collectedCount: number = 0;
  @Input() totalStamps: number = 0;
}