import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, of, throwError } from 'rxjs';
import { Pessoa } from '../../models/pessoa.model';
import { PessoaService } from '../../services/pessoa.service';
import { DetalhesPessoaComponent } from './detalhes-pessoa.component';

describe('DetalhesPessoaComponent', () => {
  let component: DetalhesPessoaComponent;
  let fixture: ComponentFixture<DetalhesPessoaComponent>;
  let pessoaServiceSpy: jasmine.SpyObj<PessoaService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockPessoa: Pessoa = {
    id: 1,
    nome: 'João Silva',
    cpf: '12345678900',
    data_nasc: '1990-01-01',
    sexo: 'M',
    altura: 1.75,
    peso: 70.0
  };

  const mockPesoIdeal = {
    peso_ideal: 69.23,
    status: 'Peso ideal calculado com sucesso',
    status_peso: 'adequado' as const
  };

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('PessoaService', ['pesquisarPorCpf', 'calcularPesoIdeal', 'excluirPessoa']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    serviceSpy.pesquisarPorCpf.and.returnValue(of(mockPessoa));
    serviceSpy.calcularPesoIdeal.and.returnValue(of(mockPesoIdeal));
    serviceSpy.excluirPessoa.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [DetalhesPessoaComponent],
      providers: [
        { provide: PessoaService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '12345678900'
              }
            }
          }
        }
      ]
    }).compileComponents();

    pessoaServiceSpy = TestBed.inject(PessoaService) as jasmine.SpyObj<PessoaService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalhesPessoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load person on init', () => {
    expect(pessoaServiceSpy.pesquisarPorCpf).toHaveBeenCalledWith('12345678900');
    expect(component.pessoa).toEqual(mockPessoa);
  });

  it('should calculate ideal weight', () => {
    component.calcularPesoIdeal();
    expect(pessoaServiceSpy.calcularPesoIdeal).toHaveBeenCalledWith('12345678900');
    expect(component.pessoa.peso_ideal).toBe(mockPesoIdeal.peso_ideal);
    expect(component.pessoa.status).toBe(mockPesoIdeal.status);
    expect(component.pessoa.status_peso).toBe(mockPesoIdeal.status_peso);
  });

  it('should handle error when loading person', () => {
    pessoaServiceSpy.pesquisarPorCpf.and.returnValue(throwError(() => new Error('Erro ao carregar')));
    spyOn(console, 'error');
    
    component.carregarPessoa('12345678900');
    
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle error when calculating ideal weight', () => {
    pessoaServiceSpy.calcularPesoIdeal.and.returnValue(throwError(() => new Error('Erro ao calcular')));
    spyOn(console, 'error');
    
    component.calcularPesoIdeal();
    
    expect(console.error).toHaveBeenCalled();
  });

  it('should format date correctly', () => {
    expect(component.formatarData('1990-01-01')).toBe('01/01/1990');
  });

  it('should get correct status class', () => {
    expect(component.getStatusClass('adequado')).toBe('text-success');
    expect(component.getStatusClass('acima')).toBe('text-danger');
    expect(component.getStatusClass('abaixo')).toBe('text-warning');
  });

  it('should show loading state when calculating ideal weight', (done) => {
    component.pessoa = mockPessoa;
    const loadingSpy = spyOn(component, 'mostrarMensagem');
    const mockResponse = {
      peso_ideal: 69.23,
      status: 'Peso ideal calculado com sucesso',
      status_peso: 'adequado' as const
    };

    // Configura o serviço para retornar a resposta mock após um delay
    pessoaServiceSpy.calcularPesoIdeal.and.returnValue(
      of(mockResponse).pipe(delay(100))
    );

    // Verifica o estado inicial
    expect(component.loading).toBeFalse();
    
    // Chama o método
    component.calcularPesoIdeal();
    fixture.detectChanges();
    
    // Verifica o estado durante o carregamento
    expect(component.loading).toBeTrue();
    expect(pessoaServiceSpy.calcularPesoIdeal).toHaveBeenCalledWith('12345678900');
    
    // Aguarda a resposta do serviço
    setTimeout(() => {
      fixture.detectChanges();
      
      // Verifica o estado após o carregamento
      expect(component.loading).toBeFalse();
      expect(loadingSpy).toHaveBeenCalledWith('Peso ideal calculado com sucesso!', 'sucesso');
      expect(component.pessoa.peso_ideal).toBe(mockResponse.peso_ideal);
      expect(component.pessoa.status).toBe(mockResponse.status);
      expect(component.pessoa.status_peso).toBe(mockResponse.status_peso);
      done();
    }, 200);
  });

  it('should navigate to edit page', () => {
    component.pessoa = mockPessoa;
    component.editarPessoa();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pessoa/editar', '12345678900']);
  });

  it('should navigate to search page after deleting person', () => {
    component.pessoa = mockPessoa;
    spyOn(window, 'confirm').and.returnValue(true);
    component.excluirPessoa();
    expect(pessoaServiceSpy.excluirPessoa).toHaveBeenCalledWith('12345678900');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pessoa/pesquisar']);
  });

  it('should handle error when deleting person', () => {
    pessoaServiceSpy.excluirPessoa.and.returnValue(throwError(() => new Error('Erro ao excluir')));
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(console, 'error');
    
    component.pessoa = mockPessoa;
    component.excluirPessoa();
    
    expect(console.error).toHaveBeenCalled();
  });
}); 