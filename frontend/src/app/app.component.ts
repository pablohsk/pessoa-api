import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    <main class="container py-4">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: []
})
export class AppComponent {
  title = 'Sistema de Gestão de Pessoas';
}
