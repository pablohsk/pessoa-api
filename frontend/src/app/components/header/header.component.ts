import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Sistema de Gestão de Pessoas</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" routerLink="/pessoa/pesquisar" routerLinkActive="active">
                Lista de Pessoas
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/pessoa/nova" routerLinkActive="active">
                Nova Pessoa
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class HeaderComponent {} 