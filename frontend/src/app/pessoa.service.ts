import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Pessoa {
  nome: string;
  data_nasc: string;
  cpf: string;
  sexo: 'M' | 'F';
  altura: number;
  peso: number;
}

export interface PesoIdealResponse {
  pesoIdeal: number;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private apiUrl = 'http://localhost:8000/api/pessoa';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro na operação.';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do servidor
      errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  incluir(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(`${this.apiUrl}/incluir/`, pessoa)
      .pipe(catchError(this.handleError));
  }

  alterar(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.apiUrl}/alterar/${pessoa.cpf}/`, pessoa)
      .pipe(catchError(this.handleError));
  }

  excluir(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/excluir/${cpf}/`)
      .pipe(catchError(this.handleError));
  }

  pesquisar(cpf: string): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/pesquisar/${cpf}/`)
      .pipe(catchError(this.handleError));
  }

  calcularPesoIdeal(pessoa: Pessoa): Observable<PesoIdealResponse> {
    return this.http.post<PesoIdealResponse>(`${this.apiUrl}/peso-ideal/`, pessoa)
      .pipe(catchError(this.handleError));
  }
} 