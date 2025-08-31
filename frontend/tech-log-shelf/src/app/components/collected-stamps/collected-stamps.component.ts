import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore, AnimalStamp } from '../../stores/app.store';

@Component({
  selector: 'app-collected-stamps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collected-stamps.component.html',
  styleUrl: './collected-stamps.component.css'
})
export class CollectedStampsComponent {
  protected readonly store = inject(AppStore);
  @Output() stampClicked = new EventEmitter<AnimalStamp>();

  onStampClick(stamp: AnimalStamp) {
    this.stampClicked.emit(stamp);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
}