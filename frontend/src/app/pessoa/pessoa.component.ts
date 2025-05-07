import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PessoaService } from '../pessoa.service';

@Component({
  selector: 'app-pessoa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pessoa.component.html',
  styleUrls: ['./pessoa.component.css']
})
export class PessoaComponent implements OnInit {
  pessoaForm: FormGroup;
  mensagem: string = '';
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';
  pesoIdeal: number | null = null;

  constructor(private fb: FormBuilder, private pessoaService: PessoaService) {
    this.pessoaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      data_nasc: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      sexo: ['M', Validators.required],
      altura: [null, [Validators.required, Validators.min(0.5), Validators.max(2.5)]],
      peso: [null, [Validators.required, Validators.min(20), Validators.max(300)]]
    });
  }

  ngOnInit(): void {}

  formatarCPF(event: any) {
    let cpf = event.target.value.replace(/\D/g, '');
    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      this.pessoaForm.patchValue({ cpf });
    }
  }

  mostrarMensagem(mensagem: string, tipo: 'sucesso' | 'erro') {
    this.mensagem = mensagem;
    this.tipoMensagem = tipo;
    setTimeout(() => {
      this.mensagem = '';
    }, 5000);
  }

  incluir() {
    if (this.pessoaForm.valid) {
      this.pessoaService.incluir(this.pessoaForm.value).subscribe({
        next: () => {
          this.mostrarMensagem('Pessoa incluída com sucesso!', 'sucesso');
          this.pessoaForm.reset({ sexo: 'M' });
        },
        error: (erro) => {
          this.mostrarMensagem('Erro ao incluir pessoa: ' + erro.message, 'erro');
        }
      });
    }
  }

  alterar() {
    if (this.pessoaForm.valid) {
      this.pessoaService.alterar(this.pessoaForm.value).subscribe({
        next: () => {
          this.mostrarMensagem('Pessoa alterada com sucesso!', 'sucesso');
        },
        error: (erro) => {
          this.mostrarMensagem('Erro ao alterar pessoa: ' + erro.message, 'erro');
        }
      });
    }
  }

  excluir() {
    const cpf = this.pessoaForm.get('cpf')?.value;
    if (cpf) {
      if (confirm('Tem certeza que deseja excluir esta pessoa?')) {
        this.pessoaService.excluir(cpf).subscribe({
          next: () => {
            this.mostrarMensagem('Pessoa excluída com sucesso!', 'sucesso');
            this.pessoaForm.reset({ sexo: 'M' });
          },
          error: (erro) => {
            this.mostrarMensagem('Erro ao excluir pessoa: ' + erro.message, 'erro');
          }
        });
      }
    }
  }

  pesquisar() {
    const cpf = this.pessoaForm.get('cpf')?.value;
    if (cpf) {
      this.pessoaService.pesquisar(cpf).subscribe({
        next: (res) => {
          if (res) {
            this.pessoaForm.patchValue(res);
            this.mostrarMensagem('Pessoa encontrada!', 'sucesso');
          } else {
            this.mostrarMensagem('Pessoa não encontrada.', 'erro');
          }
        },
        error: (erro) => {
          this.mostrarMensagem('Erro ao pesquisar pessoa: ' + erro.message, 'erro');
        }
      });
    }
  }

  calcularPesoIdeal() {
    if (this.pessoaForm.get('altura')?.value && this.pessoaForm.get('sexo')?.value) {
      this.pessoaService.calcularPesoIdeal(this.pessoaForm.value).subscribe({
        next: (res) => {
          this.pesoIdeal = res.pesoIdeal;
          this.mostrarMensagem('Peso ideal calculado com sucesso!', 'sucesso');
        },
        error: (erro) => {
          this.mostrarMensagem('Erro ao calcular peso ideal: ' + erro.message, 'erro');
        }
      });
    }
  }
} 