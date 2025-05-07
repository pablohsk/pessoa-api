import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pessoa } from '../models/pessoa.model';

interface PesoIdealResponse {
  peso_ideal: number;
  status: string;
  status_peso: 'adequado' | 'acima' | 'abaixo';
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private apiUrl = `${environment.apiUrl}/pessoa`;

  constructor(private http: HttpClient) {}

  criarPessoa(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(`${this.apiUrl}/criar/`, pessoa);
  }

  atualizarPessoa(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.apiUrl}/atualizar/`, pessoa);
  }

  excluirPessoa(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/excluir/${cpf}/`);
  }

  pesquisarPorCpf(cpf: string): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/pesquisar/${cpf}/`);
  }

  pesquisarTodos(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(`${this.apiUrl}/pesquisar/`);
  }

  calcularPesoIdeal(cpf: string): Observable<PesoIdealResponse> {
    return this.http.get<PesoIdealResponse>(`${this.apiUrl}/peso-ideal/${cpf}/`);
  }
} 