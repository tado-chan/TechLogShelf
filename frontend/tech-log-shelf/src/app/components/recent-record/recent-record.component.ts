import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../stores/app.store';

@Component({
  selector: 'app-recent-record',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-record.component.html',
  styleUrl: './recent-record.component.css'
})
export class RecentRecordComponent {
  protected readonly store = inject(AppStore);

  getStarArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  getStampById(stampId: string) {
    return this.store.animalStamps().find(stamp => stamp.id === stampId);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
}