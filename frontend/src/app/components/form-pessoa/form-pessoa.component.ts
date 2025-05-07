import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Pessoa } from '../../models/pessoa.model';
import { PessoaService } from '../../services/pessoa.service';

@Component({
  selector: 'app-form-pessoa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title mb-4">{{ isEditMode ? 'Alterar Pessoa' : 'Nova Pessoa' }}</h3>
              
              <form [formGroup]="form" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="nome" class="form-label">Nome</label>
                  <input type="text" class="form-control" id="nome" formControlName="nome"
                         [ngClass]="{'is-invalid': form.get('nome')?.invalid && form.get('nome')?.touched}">
                  <div class="invalid-feedback" *ngIf="form.get('nome')?.errors?.['required']">
                    Nome é obrigatório
                  </div>
                </div>

                <div class="mb-3">
                  <label for="cpf" class="form-label">CPF</label>
                  <input type="text" class="form-control" id="cpf" formControlName="cpf"
                         [ngClass]="{'is-invalid': form.get('cpf')?.invalid && form.get('cpf')?.touched}">
                  <div class="invalid-feedback" *ngIf="form.get('cpf')?.errors?.['required']">
                    CPF é obrigatório
                  </div>
                </div>

                <div class="mb-3">
                  <label for="data_nasc" class="form-label">Data de Nascimento</label>
                  <input type="date" class="form-control" id="data_nasc" formControlName="data_nasc"
                         [ngClass]="{'is-invalid': form.get('data_nasc')?.invalid && form.get('data_nasc')?.touched}">
                  <div class="invalid-feedback" *ngIf="form.get('data_nasc')?.errors?.['required']">
                    Data de nascimento é obrigatória
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Sexo</label>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" id="sexoM" value="M" formControlName="sexo">
                    <label class="form-check-label" for="sexoM">Masculino</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" id="sexoF" value="F" formControlName="sexo">
                    <label class="form-check-label" for="sexoF">Feminino</label>
                  </div>
                  <div class="invalid-feedback" *ngIf="form.get('sexo')?.errors?.['required']">
                    Sexo é obrigatório
                  </div>
                </div>

                <div class="mb-3">
                  <label for="altura" class="form-label">Altura (m)</label>
                  <input type="number" step="0.01" class="form-control" id="altura" formControlName="altura"
                         [ngClass]="{'is-invalid': form.get('altura')?.invalid && form.get('altura')?.touched}">
                  <div class="invalid-feedback" *ngIf="form.get('altura')?.errors?.['required']">
                    Altura é obrigatória
                  </div>
                </div>

                <div class="mb-3">
                  <label for="peso" class="form-label">Peso (kg)</label>
                  <input type="number" step="0.01" class="form-control" id="peso" formControlName="peso"
                         [ngClass]="{'is-invalid': form.get('peso')?.invalid && form.get('peso')?.touched}">
                  <div class="invalid-feedback" *ngIf="form.get('peso')?.errors?.['required']">
                    Peso é obrigatório
                  </div>
                </div>

                <div class="d-flex gap-3">
                  <button type="submit" class="btn btn-primary" [disabled]="form.invalid || loading">
                    <i class="bi bi-save"></i> {{ loading ? 'Salvando...' : 'Salvar' }}
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="cancelar()">
                    <i class="bi bi-x-circle"></i> Cancelar
                  </button>
                </div>

                <div *ngIf="mensagem" class="alert mt-3" [ngClass]="{'alert-success': tipoMensagem === 'sucesso', 'alert-danger': tipoMensagem === 'erro'}">
                  {{ mensagem }}
                </div>
              </form>
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
export class FormPessoaComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  loading = false;
  error: string | null = null;
  mensagem: string = '';
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';
  pessoa: Pessoa | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pessoaService: PessoaService
  ) {
    this.form = this.fb.group({
      nome: [null, Validators.required],
      cpf: [null, Validators.required],
      data_nasc: [null, Validators.required],
      sexo: ['M', Validators.required],
      altura: [null, Validators.required],
      peso: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const cpf = this.route.snapshot.paramMap.get('cpf');
    if (cpf) {
      this.isEditMode = true;
      this.carregarPessoa(cpf);
    }
  }

  carregarPessoa(cpf: string): void {
    this.loading = true;
    this.error = null;
    this.pessoaService.pesquisarPorCpf(cpf).subscribe({
      next: (data) => {
        this.pessoa = data;
        this.form.patchValue({
          nome: data.nome,
          cpf: data.cpf,
          data_nasc: data.data_nasc,
          sexo: data.sexo,
          altura: data.altura,
          peso: data.peso
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar dados da pessoa';
        this.loading = false;
        console.error('Erro:', err);
        this.mostrarMensagem('Erro ao carregar dados: ' + err.message, 'erro');
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const pessoaData: Pessoa = this.form.value;

    if (this.isEditMode && this.pessoa) {
      pessoaData.id = this.pessoa.id;
      this.pessoaService.atualizarPessoa(pessoaData).subscribe({
        next: () => {
          this.loading = false;
          this.mostrarMensagem('Pessoa atualizada com sucesso!', 'sucesso');
          setTimeout(() => this.router.navigate(['/pessoa/pesquisar']), 2000);
        },
        error: (err) => {
          this.error = 'Erro ao atualizar pessoa';
          this.loading = false;
          console.error('Erro:', err);
          this.mostrarMensagem('Erro ao atualizar: ' + err.message, 'erro');
        }
      });
    } else {
      this.pessoaService.criarPessoa(pessoaData).subscribe({
        next: () => {
          this.loading = false;
          this.mostrarMensagem('Pessoa criada com sucesso!', 'sucesso');
          setTimeout(() => this.router.navigate(['/pessoa/pesquisar']), 2000);
        },
        error: (err) => {
          this.error = 'Erro ao criar pessoa';
          this.loading = false;
          console.error('Erro:', err);
          this.mostrarMensagem('Erro ao criar: ' + err.message, 'erro');
        }
      });
    }
  }

  mostrarMensagem(mensagem: string, tipo: 'sucesso' | 'erro') {
    this.mensagem = mensagem;
    this.tipoMensagem = tipo;
    setTimeout(() => {
      this.mensagem = '';
    }, 5000);
  }

  cancelar(): void {
    this.router.navigate(['/pessoa/pesquisar']);
  }
} 