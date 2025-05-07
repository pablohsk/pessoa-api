import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { Pessoa } from '../models/pessoa.model';
import { PessoaService } from './pessoa.service';

describe('PessoaService', () => {
  let service: PessoaService;
  let httpMock: HttpTestingController;

  const mockPessoa: Pessoa = {
    nome: 'João Silva',
    cpf: '12345678900',
    data_nasc: '1990-01-01',
    sexo: 'M',
    altura: 1.75,
    peso: 70.0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PessoaService]
    });

    service = TestBed.inject(PessoaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a person', () => {
    service.criarPessoa(mockPessoa).subscribe(response => {
      expect(response).toEqual(mockPessoa);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pessoa/criar/`);
    expect(req.request.method).toBe('POST');
    req.flush(mockPessoa);
  });

  it('should update a person', () => {
    const pessoaAtualizada = { ...mockPessoa, nome: 'João Silva Atualizado' };
    
    service.atualizarPessoa(pessoaAtualizada).subscribe(response => {
      expect(response).toEqual(pessoaAtualizada);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pessoa/atualizar/`);
    expect(req.request.method).toBe('PUT');
    req.flush(pessoaAtualizada);
  });

  it('should delete a person', () => {
    service.excluirPessoa(mockPessoa.cpf).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/pessoa/excluir/${mockPessoa.cpf}/`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should search a person by CPF', () => {
    service.pesquisarPorCpf(mockPessoa.cpf).subscribe(response => {
      expect(response).toEqual(mockPessoa);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pessoa/pesquisar/${mockPessoa.cpf}/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPessoa);
  });

  it('should list all people', () => {
    const mockPessoas = [mockPessoa];

    service.pesquisarTodos().subscribe(response => {
      expect(response).toEqual(mockPessoas);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pessoa/pesquisar/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPessoas);
  });

  it('should calculate ideal weight', () => {
    const mockResponse = {
      peso_ideal: 69.23,
      status: 'Peso ideal calculado com sucesso',
      status_peso: 'adequado' as const
    };

    service.calcularPesoIdeal(mockPessoa.cpf).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pessoa/peso-ideal/${mockPessoa.cpf}/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error when creating person', () => {
    const errorMessage = 'CPF já cadastrado';

    service.criarPessoa(mockPessoa).subscribe({
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pessoa/criar/`);
    req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
  });

  it('should handle error when person not found', () => {
    service.pesquisarPorCpf('00000000000').subscribe({
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/pessoa/pesquisar/00000000000/`);
    req.flush('Pessoa não encontrada', { status: 404, statusText: 'Not Found' });
  });
}); 