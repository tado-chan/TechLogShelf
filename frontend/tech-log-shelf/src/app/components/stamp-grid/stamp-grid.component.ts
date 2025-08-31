import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StampSlot } from '../../stores/app.store';

@Component({
  selector: 'app-stamp-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stamp-grid.component.html',
  styleUrl: './stamp-grid.component.css'
})
export class StampGridComponent {
  @Input() stampGrid: StampSlot[][] = [];
  @Input() collectedCount: number = 0;
}