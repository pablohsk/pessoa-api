import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="bg-primary text-white p-3">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="h4 mb-0">Sistema de Pessoas</h1>
          <nav>
            <a routerLink="/adicionar" class="btn btn-outline-light me-2">
              Adicionar Pessoa
            </a>
            <a routerLink="/pesquisar" class="btn btn-outline-light">
              Pesquisar Pessoa
            </a>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [`
    header {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class HeaderComponent {
  constructor(private router: Router) {}
} 