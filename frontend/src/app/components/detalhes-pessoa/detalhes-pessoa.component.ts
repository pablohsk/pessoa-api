import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pessoa } from '../../models/pessoa.model';
import { PessoaService } from '../../services/pessoa.service';

@Component({
  selector: 'app-detalhes-pessoa',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title mb-4">{{ pessoa.nome }}</h3>
              
              <div class="mb-4">
                <p><strong>CPF:</strong> {{ pessoa.cpf }}</p>
                <p><strong>Data de Nascimento:</strong> {{ formatarData(pessoa.data_nasc) }}</p>
                <p><strong>Sexo:</strong> {{ pessoa.sexo === 'M' ? 'Masculino' : 'Feminino' }}</p>
                <p><strong>Altura:</strong> {{ pessoa.altura }}m</p>
                <p><strong>Peso:</strong> {{ pessoa.peso }}kg</p>
                <p *ngIf="pessoa.peso_ideal"><strong>Peso Ideal:</strong> {{ pessoa.peso_ideal }}kg</p>
                <p *ngIf="pessoa.status" [ngClass]="getStatusClass(pessoa.status_peso)">
                  <strong>Status:</strong> {{ pessoa.status }}
                </p>
              </div>

              <div class="d-flex gap-3">
                <button class="btn btn-primary" (click)="calcularPesoIdeal()" [disabled]="loading">
                  <i class="bi bi-calculator"></i> {{ loading ? 'Calculando...' : 'Calcular Peso Ideal' }}
                </button>
                <button class="btn btn-warning" (click)="editarPessoa()">
                  <i class="bi bi-pencil"></i> Alterar
                </button>
                <button class="btn btn-danger" (click)="excluirPessoa()">
                  <i class="bi bi-trash"></i> Excluir
                </button>
              </div>

              <div *ngIf="mensagem" class="alert mt-3" [ngClass]="{'alert-success': tipoMensagem === 'sucesso', 'alert-danger': tipoMensagem === 'erro'}">
                {{ mensagem }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn {
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn i {
      font-size: 1.1rem;
    }
    .btn:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
    .text-success {
      color: #28a745;
    }
    .text-danger {
      color: #dc3545;
    }
    .text-warning {
      color: #ffc107;
    }
  `]
})
export class DetalhesPessoaComponent implements OnInit {
  pessoa: Pessoa = {
    nome: '',
    data_nasc: '',
    cpf: '',
    sexo: 'M',
    altura: 0,
    peso: 0
  };
  loading = false;
  error: string | null = null;
  mensagem: string = '';
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pessoaService: PessoaService
  ) {}

  ngOnInit(): void {
    const cpf = this.route.snapshot.paramMap.get('cpf');
    if (cpf) {
      this.carregarPessoa(cpf);
    }
  }

  carregarPessoa(cpf: string): void {
    this.loading = true;
    this.error = null;
    this.pessoaService.pesquisarPorCpf(cpf).subscribe({
      next: (data) => {
        this.pessoa = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar dados da pessoa';
        this.loading = false;
        console.error('Erro:', err);
      }
    });
  }

  calcularPesoIdeal(): void {
    if (!this.pessoa?.cpf) return;

    this.loading = true;
    this.error = null;
    this.pessoaService.calcularPesoIdeal(this.pessoa.cpf).subscribe({
      next: (data) => {
        this.pessoa.peso_ideal = data.peso_ideal;
        this.pessoa.status = data.status;
        this.pessoa.status_peso = data.status_peso;
        this.loading = false;
        this.mostrarMensagem('Peso ideal calculado com sucesso!', 'sucesso');
      },
      error: (err) => {
        this.error = 'Erro ao calcular peso ideal';
        this.loading = false;
        console.error('Erro:', err);
        this.mostrarMensagem('Erro ao calcular peso ideal: ' + err.message, 'erro');
      }
    });
  }

  mostrarMensagem(mensagem: string, tipo: 'sucesso' | 'erro') {
    this.mensagem = mensagem;
    this.tipoMensagem = tipo;
    setTimeout(() => {
      this.mensagem = '';
    }, 5000);
  }

  editarPessoa() {
    this.router.navigate(['/pessoa/editar', this.pessoa.cpf]);
  }

  excluirPessoa() {
    if (confirm('Tem certeza que deseja excluir esta pessoa?')) {
      this.loading = true;
      this.error = null;
      this.pessoaService.excluirPessoa(this.pessoa.cpf).subscribe({
        next: () => {
          this.router.navigate(['/pessoa/pesquisar']);
        },
        error: (err) => {
          this.error = 'Erro ao excluir pessoa';
          this.loading = false;
          console.error('Erro:', err);
          this.mostrarMensagem('Erro ao excluir pessoa: ' + err.message, 'erro');
        }
      });
    }
  }

  formatarData(data: string): string {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'adequado':
        return 'text-success';
      case 'acima':
        return 'text-danger';
      case 'abaixo':
        return 'text-warning';
      default:
        return '';
    }
  }
} 