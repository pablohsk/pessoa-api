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
              <h3 class="card-title mb-4">{{ isEditing ? 'Alterar Pessoa' : 'Adicionar Pessoa' }}</h3>
              
              <form [formGroup]="pessoaForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="nome" class="form-label">Nome</label>
                  <input type="text" class="form-control" id="nome" formControlName="nome">
                  <div class="text-danger" *ngIf="pessoaForm.get('nome')?.errors?.['required'] && pessoaForm.get('nome')?.touched">
                    Nome é obrigatório
                  </div>
                </div>

                <div class="mb-3">
                  <label for="data_nasc" class="form-label">Data de Nascimento</label>
                  <input type="date" class="form-control" id="data_nasc" formControlName="data_nasc">
                  <div class="text-danger" *ngIf="pessoaForm.get('data_nasc')?.errors?.['required'] && pessoaForm.get('data_nasc')?.touched">
                    Data de nascimento é obrigatória
                  </div>
                </div>

                <div class="mb-3">
                  <label for="cpf" class="form-label">CPF</label>
                  <input type="text" class="form-control" id="cpf" formControlName="cpf" [readonly]="isEditing">
                  <div class="text-danger" *ngIf="pessoaForm.get('cpf')?.errors?.['required'] && pessoaForm.get('cpf')?.touched">
                    CPF é obrigatório
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
                  <div class="text-danger" *ngIf="pessoaForm.get('sexo')?.errors?.['required'] && pessoaForm.get('sexo')?.touched">
                    Sexo é obrigatório
                  </div>
                </div>

                <div class="mb-3">
                  <label for="altura" class="form-label">Altura (m)</label>
                  <input type="number" step="0.01" class="form-control" id="altura" formControlName="altura">
                  <div class="text-danger" *ngIf="pessoaForm.get('altura')?.errors?.['required'] && pessoaForm.get('altura')?.touched">
                    Altura é obrigatória
                  </div>
                </div>

                <div class="mb-3">
                  <label for="peso" class="form-label">Peso (kg)</label>
                  <input type="number" step="0.1" class="form-control" id="peso" formControlName="peso">
                  <div class="text-danger" *ngIf="pessoaForm.get('peso')?.errors?.['required'] && pessoaForm.get('peso')?.touched">
                    Peso é obrigatório
                  </div>
                </div>

                <div class="d-flex gap-3">
                  <button type="submit" class="btn btn-primary" [disabled]="pessoaForm.invalid">
                    {{ isEditing ? 'Salvar Alterações' : 'Adicionar' }}
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="voltar()">Cancelar</button>
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
  `]
})
export class FormPessoaComponent implements OnInit {
  pessoaForm: FormGroup;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.pessoaForm = this.fb.group({
      nome: ['', Validators.required],
      data_nasc: ['', Validators.required],
      cpf: ['', Validators.required],
      sexo: ['M', Validators.required],
      altura: ['', Validators.required],
      peso: ['', Validators.required]
    });
  }

  ngOnInit() {
    const cpf = this.route.snapshot.paramMap.get('cpf');
    if (cpf) {
      this.isEditing = true;
      this.carregarPessoa(cpf);
    }
  }

  carregarPessoa(cpf: string) {
    this.pessoaService.pesquisarPorCpf(cpf).subscribe(
      (pessoa: Pessoa) => {
        this.pessoaForm.patchValue(pessoa);
      },
      (erro: any) => {
        console.error('Erro ao carregar pessoa:', erro);
      }
    );
  }

  onSubmit() {
    if (this.pessoaForm.valid) {
      const pessoa: Pessoa = this.pessoaForm.value;
      
      if (this.isEditing) {
        this.pessoaService.alterar(pessoa.cpf, pessoa).subscribe(
          () => {
            this.router.navigate(['/pesquisar']);
          },
          (erro: any) => {
            console.error('Erro ao alterar pessoa:', erro);
          }
        );
      } else {
        this.pessoaService.incluir(pessoa).subscribe(
          () => {
            this.router.navigate(['/pesquisar']);
          },
          (erro: any) => {
            console.error('Erro ao incluir pessoa:', erro);
          }
        );
      }
    }
  }

  voltar() {
    this.router.navigate(['/pesquisar']);
  }
} 