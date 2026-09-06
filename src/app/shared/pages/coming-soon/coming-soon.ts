import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmptyState } from '../../components/empty-state/empty-state';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [EmptyState],
  template: `
    <div class="coming-soon">
      <h1>{{ title }}</h1>
      <app-empty-state icon="🚧" [title]="title + ' is coming soon'" subtitle="This feature is under construction."></app-empty-state>
    </div>
  `,
  styles: [`
    .coming-soon { max-width: 1200px; }
    h1 { margin: 0 0 1.25rem; }
  `]
})
export class ComingSoon {
  readonly title: string;

  constructor(route: ActivatedRoute) {
    this.title = (route.snapshot.data['title'] as string | undefined) ?? 'Feature';
  }
}
