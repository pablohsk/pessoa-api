import { Routes } from '@angular/router';
import { DetalhesPessoaComponent } from './components/detalhes-pessoa/detalhes-pessoa.component';
import { FormPessoaComponent } from './components/form-pessoa/form-pessoa.component';
import { PesquisarPessoaComponent } from './components/pesquisar-pessoa/pesquisar-pessoa.component';

export const routes: Routes = [
  { path: '', redirectTo: '/pesquisar', pathMatch: 'full' },
  { path: 'pesquisar', component: PesquisarPessoaComponent },
  { path: 'detalhes/:cpf', component: DetalhesPessoaComponent },
  { path: 'adicionar', component: FormPessoaComponent },
  { path: 'alterar/:cpf', component: FormPessoaComponent }
];
