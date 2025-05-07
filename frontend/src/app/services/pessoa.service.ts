import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pessoa } from '../models/pessoa.model';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private apiUrl = 'http://localhost:8000/api/pessoa';

  constructor(private http: HttpClient) {}

  incluir(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(`${this.apiUrl}/incluir/`, pessoa);
  }

  alterar(cpf: string, pessoa: Pessoa): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.apiUrl}/alterar/${cpf}/`, pessoa);
  }

  excluir(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/excluir/${cpf}/`);
  }

  pesquisarPorCpf(cpf: string): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/pesquisar/${cpf}/`);
  }

  pesquisarTodos(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(`${this.apiUrl}/pesquisar/`);
  }

  calcularPesoIdeal(cpf: string): Observable<{ peso_ideal: number }> {
    return this.http.get<{ peso_ideal: number }>(`${this.apiUrl}/peso-ideal/${cpf}/`);
  }
} 