import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Pessoa } from '../../models/pessoa.model';
import { PessoaService } from '../../services/pessoa.service';
import { PesquisarPessoaComponent } from './pesquisar-pessoa.component';

describe('PesquisarPessoaComponent', () => {
  let component: PesquisarPessoaComponent;
  let fixture: ComponentFixture<PesquisarPessoaComponent>;
  let pessoaServiceSpy: jasmine.SpyObj<PessoaService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockPessoas: Pessoa[] = [
    {
      id: 1,
      nome: 'João Silva',
      cpf: '12345678900',
      data_nasc: '1990-01-01',
      sexo: 'M',
      altura: 1.75,
      peso: 70.0,
      peso_ideal: 69.23,
      status: 'Peso ideal calculado com sucesso',
      status_peso: 'adequado'
    },
    {
      id: 2,
      nome: 'Maria Santos',
      cpf: '98765432100',
      data_nasc: '1992-05-15',
      sexo: 'F',
      altura: 1.65,
      peso: 55.0,
      peso_ideal: 57.77,
      status: 'Peso ideal calculado com sucesso',
      status_peso: 'abaixo'
    }
  ];

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('PessoaService', ['pesquisarTodos', 'excluirPessoa']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    serviceSpy.pesquisarTodos.and.returnValue(of(mockPessoas));
    serviceSpy.excluirPessoa.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [PesquisarPessoaComponent, FormsModule],
      providers: [
        { provide: PessoaService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    pessoaServiceSpy = TestBed.inject(PessoaService) as jasmine.SpyObj<PessoaService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PesquisarPessoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load people on init', () => {
    expect(pessoaServiceSpy.pesquisarTodos).toHaveBeenCalled();
    expect(component.pessoas).toEqual(mockPessoas);
  });

  it('should filter people by name', () => {
    component.filtro.nome = 'João';
    expect(component.pessoasFiltradas.length).toBe(1);
    expect(component.pessoasFiltradas[0].nome).toBe('João Silva');
  });

  it('should filter people by CPF', () => {
    component.filtro.cpf = '12345678900';
    expect(component.pessoasFiltradas.length).toBe(1);
    expect(component.pessoasFiltradas[0].cpf).toBe('12345678900');
  });

  it('should filter people by height', () => {
    component.filtro.altura = 1.75;
    expect(component.pessoasFiltradas.length).toBe(1);
    expect(component.pessoasFiltradas[0].altura).toBe(1.75);
  });

  it('should filter people by weight', () => {
    component.filtro.peso = 70.0;
    expect(component.pessoasFiltradas.length).toBe(1);
    expect(component.pessoasFiltradas[0].peso).toBe(70.0);
  });

  it('should delete a person', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.excluirPessoa('12345678900');
    expect(pessoaServiceSpy.excluirPessoa).toHaveBeenCalledWith('12345678900');
    expect(pessoaServiceSpy.pesquisarTodos).toHaveBeenCalled();
  });

  it('should handle error when deleting person', (done) => {
    const error = new Error('Erro ao excluir');
    pessoaServiceSpy.excluirPessoa.and.returnValue(throwError(() => error));
    spyOn(window, 'confirm').and.returnValue(true);
    const consoleSpy = spyOn(console, 'error');
    
    component.excluirPessoa('12345678900');
    fixture.detectChanges();
    
    setTimeout(() => {
      fixture.detectChanges();
      expect(consoleSpy).toHaveBeenCalledWith('Erro:', error);
      expect(component.error).toBe('Erro ao excluir pessoa');
      expect(component.loading).toBeFalse();
      done();
    }, 100);
  });

  it('should handle error when loading people', (done) => {
    const error = new Error('Erro ao carregar');
    pessoaServiceSpy.pesquisarTodos.and.returnValue(throwError(() => error));
    const consoleSpy = spyOn(console, 'error');
    
    component.pessoas = [];
    component.carregarPessoas();
    fixture.detectChanges();
    
    setTimeout(() => {
      fixture.detectChanges();
      expect(consoleSpy).toHaveBeenCalledWith('Erro:', error);
      expect(component.error).toBe('Erro ao carregar lista de pessoas');
      expect(component.loading).toBeFalse();
      expect(component.pessoas).toEqual([]);
      done();
    }, 100);
  });

  it('should clear filters', () => {
    component.filtro = {
      nome: 'João',
      cpf: '12345678900',
      altura: 1.75,
      peso: 70.0
    };

    component.limparFiltros();

    expect(component.filtro).toEqual({
      nome: '',
      cpf: '',
      altura: undefined,
      peso: undefined
    });
  });

  it('should format date correctly', () => {
    const date = '1990-01-01';
    expect(component.formatarData(date)).toBe('01/01/1990');
  });

  it('should get correct status class', () => {
    expect(component.getStatusClass('adequado')).toBe('status-adequado');
    expect(component.getStatusClass('acima')).toBe('status-acima');
    expect(component.getStatusClass('abaixo')).toBe('status-abaixo');
  });

  it('should navigate to details page', () => {
    component.verDetalhes('12345678900');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pessoa/detalhes', '12345678900']);
  });

  it('should navigate to edit page', () => {
    component.editarPessoa('12345678900');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pessoa/editar', '12345678900']);
  });

  it('should navigate to create page', () => {
    component.novaPessoa();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pessoa/nova']);
  });
}); 