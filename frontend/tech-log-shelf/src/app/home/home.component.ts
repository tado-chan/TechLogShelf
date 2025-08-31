import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore, AnimalStamp } from '../stores/app.store';
import { StampGridComponent } from '../components/stamp-grid/stamp-grid.component';
import { CollectedStampsComponent } from '../components/collected-stamps/collected-stamps.component';
import { RecentRecordComponent } from '../components/recent-record/recent-record.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, StampGridComponent, CollectedStampsComponent, RecentRecordComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  protected readonly store = inject(AppStore);

  openRegistrationForm() {
    console.log('Opening reading record registration form...');
    // TODO: Navigate to registration form or open modal
  }

  onStampClicked(stamp: AnimalStamp) {
    console.log('Stamp clicked:', stamp);
    // TODO: Navigate to reading records page filtered by this stamp
  }
}