import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore } from '../stores/app.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <h1>Welcome to TechLogShelf</h1>
      <p>Your personal tech blog platform</p>
      
      <div class="stats-section">
        <div class="stat-card">
          <h3>Total Posts</h3>
          <p class="stat-number">{{ store.totalPosts() }}</p>
        </div>
        <div class="stat-card">
          <h3>Total Views</h3>
          <p class="stat-number">{{ store.totalViews() }}</p>
        </div>
      </div>

      <div class="actions-section">
        <button class="primary-btn" (click)="createNewPost()">Create New Post</button>
        <button class="secondary-btn" (click)="viewAllPosts()">View All Posts</button>
      </div>
    </div>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  protected readonly store = inject(AppStore);

  createNewPost() {
    console.log('Creating new post...');
  }

  viewAllPosts() {
    console.log('Viewing all posts...');
  }
}