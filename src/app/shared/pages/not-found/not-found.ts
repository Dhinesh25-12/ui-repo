import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="status-page">
      <h1>404</h1>
      <p>The page you are looking for could not be found.</p>
      <a routerLink="/dashboard">Go to dashboard</a>
    </div>
  `,
  styles: [`
    .status-page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; }
    h1 { font-size: 3rem; margin: 0; color: #374151; }
    a { color: #2563eb; }
  `]
})
export class NotFound {}
