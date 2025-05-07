import { Routes } from '@angular/router';
import { DetalhesPessoaComponent } from './components/detalhes-pessoa/detalhes-pessoa.component';
import { FormPessoaComponent } from './components/form-pessoa/form-pessoa.component';
import { PesquisarPessoaComponent } from './components/pesquisar-pessoa/pesquisar-pessoa.component';

export const routes: Routes = [
  { path: '', redirectTo: '/pessoa/pesquisar', pathMatch: 'full' },
  { path: 'pessoa/pesquisar', component: PesquisarPessoaComponent },
  { path: 'pessoa/detalhes/:cpf', component: DetalhesPessoaComponent },
  { path: 'pessoa/nova', component: FormPessoaComponent },
  { path: 'pessoa/editar/:cpf', component: FormPessoaComponent },
  { path: '**', redirectTo: '/pessoa/pesquisar' }
];
