import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Pessoa } from '../../models/pessoa.model';
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
              <h5 class="card-title">Filtros de Pesquisa</h5>
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
          <div class="card h-100" (click)="verDetalhes(pessoa)">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <h5 class="card-title">{{ pessoa.nome }}</h5>
                <div class="status-indicator" [ngClass]="{'status-ok': pessoa.peso <= (pessoa.pesoIdeal || 0), 'status-alert': pessoa.peso > (pessoa.pesoIdeal || 0)}"></div>
              </div>
              <p class="card-text">
                <strong>CPF:</strong> {{ pessoa.cpf }}<br>
                <strong>Data Nascimento:</strong> {{ pessoa.data_nasc | date:'dd/MM/yyyy' }}<br>
                <strong>Sexo:</strong> {{ pessoa.sexo === 'M' ? 'Masculino' : 'Feminino' }}<br>
                <strong>Altura:</strong> {{ pessoa.altura }}m<br>
                <strong>Peso:</strong> {{ pessoa.peso }}kg
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      cursor: pointer;
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
    .status-ok {
      background-color: #28a745;
    }
    .status-alert {
      background-color: #dc3545;
    }
  `]
})
export class PesquisarPessoaComponent implements OnInit {
  pessoas: Pessoa[] = [];
  filtro = {
    nome: '',
    cpf: '',
    altura: null,
    peso: null
  };

  constructor(
    private pessoaService: PessoaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarPessoas();
  }

  carregarPessoas() {
    this.pessoaService.pesquisarTodos().subscribe(
      (pessoas: Pessoa[]) => {
        this.pessoas = pessoas;
        // Calcular peso ideal para cada pessoa
        this.pessoas.forEach(pessoa => {
          this.pessoaService.calcularPesoIdeal(pessoa.cpf).subscribe(
            (resultado: { peso_ideal: number }) => {
              pessoa.pesoIdeal = resultado.peso_ideal;
            },
            (erro: any) => {
              console.error('Erro ao calcular peso ideal:', erro);
            }
          );
        });
      },
      (erro: any) => {
        console.error('Erro ao carregar pessoas:', erro);
      }
    );
  }

  get pessoasFiltradas() {
    return this.pessoas.filter(pessoa => {
      return (!this.filtro.nome || pessoa.nome.toLowerCase().includes(this.filtro.nome.toLowerCase())) &&
             (!this.filtro.cpf || pessoa.cpf.includes(this.filtro.cpf)) &&
             (!this.filtro.altura || pessoa.altura === this.filtro.altura) &&
             (!this.filtro.peso || pessoa.peso === this.filtro.peso);
    });
  }

  verDetalhes(pessoa: Pessoa) {
    this.router.navigate(['/detalhes', pessoa.cpf]);
  }
} 