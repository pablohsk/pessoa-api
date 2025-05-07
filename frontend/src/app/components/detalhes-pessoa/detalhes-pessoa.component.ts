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
                <p><strong>Data de Nascimento:</strong> {{ pessoa.data_nasc | date:'dd/MM/yyyy' }}</p>
                <p><strong>Sexo:</strong> {{ pessoa.sexo === 'M' ? 'Masculino' : 'Feminino' }}</p>
                <p><strong>Altura:</strong> {{ pessoa.altura }}m</p>
                <p><strong>Peso:</strong> {{ pessoa.peso }}kg</p>
                <p *ngIf="pesoIdeal > 0"><strong>Peso Ideal:</strong> {{ pesoIdeal }}kg</p>
                <p *ngIf="statusCalculado" [ngClass]="{'text-success': pessoa.peso <= pesoIdeal, 'text-danger': pessoa.peso > pesoIdeal}">
                  <strong>Status:</strong> {{ pessoa.peso <= pesoIdeal ? 'Peso adequado' : 'Acima do peso ideal' }}
                </p>
              </div>

              <div class="d-flex gap-3">
                <button class="btn btn-primary" (click)="calcularPesoIdeal()" [disabled]="calculando">
                  <i class="bi bi-calculator"></i> {{ calculando ? 'Calculando...' : 'Calcular Peso Ideal' }}
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
  pesoIdeal: number = 0;
  calculando: boolean = false;
  statusCalculado: boolean = false;
  mensagem: string = '';
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pessoaService: PessoaService
  ) {}

  ngOnInit() {
    const cpf = this.route.snapshot.paramMap.get('cpf');
    if (cpf) {
      this.carregarPessoa(cpf);
    }
  }

  carregarPessoa(cpf: string) {
    this.pessoaService.pesquisarPorCpf(cpf).subscribe(
      (pessoa: Pessoa) => {
        this.pessoa = pessoa;
      },
      (erro: any) => {
        this.mostrarMensagem('Erro ao carregar pessoa: ' + erro.message, 'erro');
      }
    );
  }

  calcularPesoIdeal() {
    this.calculando = true;
    this.mensagem = '';
    this.pessoaService.calcularPesoIdeal(this.pessoa.cpf).subscribe(
      (resultado: { peso_ideal: number }) => {
        this.pesoIdeal = resultado.peso_ideal;
        this.statusCalculado = true;
        this.mostrarMensagem('Peso ideal calculado com sucesso!', 'sucesso');
        this.calculando = false;
      },
      (erro: any) => {
        this.mostrarMensagem('Erro ao calcular peso ideal: ' + erro.message, 'erro');
        this.calculando = false;
      }
    );
  }

  mostrarMensagem(mensagem: string, tipo: 'sucesso' | 'erro') {
    this.mensagem = mensagem;
    this.tipoMensagem = tipo;
    setTimeout(() => {
      this.mensagem = '';
    }, 5000);
  }

  editarPessoa() {
    this.router.navigate(['/alterar', this.pessoa.cpf]);
  }

  excluirPessoa() {
    if (confirm('Tem certeza que deseja excluir esta pessoa?')) {
      this.pessoaService.excluir(this.pessoa.cpf).subscribe(
        () => {
          this.router.navigate(['/pesquisar']);
        },
        (erro: any) => {
          this.mostrarMensagem('Erro ao excluir pessoa: ' + erro.message, 'erro');
        }
      );
    }
  }
} 