import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FiltroPessoa, Pessoa } from '../../models/pessoa.model';
import { PessoaService } from '../../services/pessoa.service';

@Component({
  selector: 'app-pesquisar-pessoa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row mb-4">
        <div class="col">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="card-title mb-0">Filtros de Pesquisa</h5>
                <button class="btn btn-primary" (click)="novaPessoa()">
                  <i class="bi bi-plus-circle"></i> Nova Pessoa
                </button>
              </div>
              <div class="row g-3">
                <div class="col-md-3">
                  <input type="text" class="form-control" placeholder="Nome" [(ngModel)]="filtro.nome">
                </div>
                <div class="col-md-3">
                  <input type="text" class="form-control" placeholder="CPF" [(ngModel)]="filtro.cpf">
                </div>
                <div class="col-md-3">
                  <input type="number" class="form-control" placeholder="Altura" [(ngModel)]="filtro.altura">
                </div>
                <div class="col-md-3">
                  <input type="number" class="form-control" placeholder="Peso" [(ngModel)]="filtro.peso">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let pessoa of pessoasFiltradas">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <h5 class="card-title">{{ pessoa.nome }}</h5>
                <div class="status-indicator" [ngClass]="getStatusClass(pessoa.status_peso)"></div>
              </div>
              <p class="card-text">
                <strong>CPF:</strong> {{ pessoa.cpf }}<br>
                <strong>Data Nascimento:</strong> {{ formatarData(pessoa.data_nasc) }}<br>
                <strong>Sexo:</strong> {{ pessoa.sexo === 'M' ? 'Masculino' : 'Feminino' }}<br>
                <strong>Altura:</strong> {{ pessoa.altura }}m<br>
                <strong>Peso:</strong> {{ pessoa.peso }}kg
              </p>
              <div class="d-flex gap-2">
                <button class="btn btn-info btn-sm" (click)="verDetalhes(pessoa.cpf)">
                  <i class="bi bi-eye"></i> Detalhes
                </button>
                <button class="btn btn-warning btn-sm" (click)="editarPessoa(pessoa.cpf)">
                  <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" (click)="excluirPessoa(pessoa.cpf)">
                  <i class="bi bi-trash"></i> Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .status-adequado {
      background-color: #28a745;
    }
    .status-acima {
      background-color: #dc3545;
    }
    .status-abaixo {
      background-color: #ffc107;
    }
    .btn {
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn i {
      font-size: 1.1rem;
    }
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
  `]
})
export class PesquisarPessoaComponent implements OnInit {
  pessoas: Pessoa[] = [];
  filtro: FiltroPessoa = {
    nome: '',
    cpf: '',
    altura: undefined,
    peso: undefined
  };
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private pessoaService: PessoaService
  ) {}

  ngOnInit(): void {
    this.carregarPessoas();
  }

  carregarPessoas(): void {
    this.loading = true;
    this.error = null;
    this.pessoaService.pesquisarTodos().subscribe({
      next: (data) => {
        this.pessoas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar lista de pessoas';
        this.loading = false;
        console.error('Erro:', err);
      }
    });
  }

  get pessoasFiltradas(): Pessoa[] {
    return this.pessoas.filter(pessoa => {
      return (!this.filtro.nome || pessoa.nome.toLowerCase().includes(this.filtro.nome.toLowerCase())) &&
             (!this.filtro.cpf || pessoa.cpf.includes(this.filtro.cpf)) &&
             (!this.filtro.altura || pessoa.altura === this.filtro.altura) &&
             (!this.filtro.peso || pessoa.peso === this.filtro.peso);
    });
  }

  verDetalhes(cpf: string): void {
    this.router.navigate(['/pessoa/detalhes', cpf]);
  }

  editarPessoa(cpf: string): void {
    this.router.navigate(['/pessoa/editar', cpf]);
  }

  novaPessoa(): void {
    this.router.navigate(['/pessoa/nova']);
  }

  excluirPessoa(cpf: string): void {
    if (confirm('Tem certeza que deseja excluir esta pessoa?')) {
      this.loading = true;
      this.error = null;
      this.pessoaService.excluirPessoa(cpf).subscribe({
        next: () => {
          this.carregarPessoas();
        },
        error: (err) => {
          this.error = 'Erro ao excluir pessoa';
          this.loading = false;
          console.error('Erro:', err);
        }
      });
    }
  }

  limparFiltros(): void {
    this.filtro = {
      nome: '',
      cpf: '',
      altura: undefined,
      peso: undefined
    };
  }

  formatarData(data: string): string {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'adequado':
        return 'status-adequado';
      case 'acima':
        return 'status-acima';
      case 'abaixo':
        return 'status-abaixo';
      default:
        return '';
    }
  }
} 