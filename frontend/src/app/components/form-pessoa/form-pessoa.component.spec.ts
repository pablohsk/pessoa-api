import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Pessoa } from '../../models/pessoa.model';
import { PessoaService } from '../../services/pessoa.service';
import { FormPessoaComponent } from './form-pessoa.component';

describe('FormPessoaComponent', () => {
  let component: FormPessoaComponent;
  let fixture: ComponentFixture<FormPessoaComponent>;
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

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PessoaService', ['criarPessoa', 'atualizarPessoa', 'pesquisarPorCpf']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    spy.criarPessoa.and.returnValue(of(mockPessoa));
    spy.atualizarPessoa.and.returnValue(of(mockPessoa));
    spy.pesquisarPorCpf.and.returnValue(of(mockPessoa));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormPessoaComponent],
      providers: [
        { provide: PessoaService, useValue: spy },
        { provide: Router, useValue: routerSpyObj },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => null } } }
        }
      ]
    }).compileComponents();

    pessoaServiceSpy = TestBed.inject(PessoaService) as jasmine.SpyObj<PessoaService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPessoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('nome')?.value).toBeNull();
    expect(component.form.get('cpf')?.value).toBeNull();
    expect(component.form.get('data_nasc')?.value).toBeNull();
    expect(component.form.get('sexo')?.value).toBe('M');
    expect(component.form.get('altura')?.value).toBeNull();
    expect(component.form.get('peso')?.value).toBeNull();
  });

  it('should validate required fields', () => {
    const form = component.form;
    expect(form.valid).toBeFalsy();

    const nomeControl = form.get('nome');
    const cpfControl = form.get('cpf');
    const dataNascControl = form.get('data_nasc');
    const alturaControl = form.get('altura');
    const pesoControl = form.get('peso');

    expect(nomeControl?.errors?.['required']).toBeTruthy();
    expect(cpfControl?.errors?.['required']).toBeTruthy();
    expect(dataNascControl?.errors?.['required']).toBeTruthy();
    expect(alturaControl?.errors?.['required']).toBeTruthy();
    expect(pesoControl?.errors?.['required']).toBeTruthy();
  });

  it('should create a new person', () => {
    const mockPessoa: Pessoa = {
      nome: 'Teste',
      cpf: '12345678900',
      data_nasc: '1990-01-01',
      sexo: 'M',
      altura: 1.75,
      peso: 70
    };

    pessoaServiceSpy.criarPessoa.and.returnValue(of(mockPessoa));
    spyOn(component, 'mostrarMensagem');

    component.form.patchValue(mockPessoa);
    component.onSubmit();

    expect(pessoaServiceSpy.criarPessoa).toHaveBeenCalledWith(mockPessoa);
    expect(component.mostrarMensagem).toHaveBeenCalledWith('Pessoa criada com sucesso!', 'sucesso');
  });

  it('should handle error when creating a person', () => {
    const error = new Error('Erro ao criar pessoa');
    pessoaServiceSpy.criarPessoa.and.returnValue(throwError(() => error));
    spyOn(console, 'error');
    spyOn(component, 'mostrarMensagem');

    component.form.patchValue({
      nome: 'Teste',
      cpf: '12345678900',
      data_nasc: '1990-01-01',
      sexo: 'M',
      altura: 1.75,
      peso: 70
    });

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Erro:', error);
    expect(component.mostrarMensagem).toHaveBeenCalledWith('Erro ao criar: ' + error.message, 'erro');
    expect(component.loading).toBeFalse();
  });

  it('should update an existing person', (done) => {
    const mensagemSpy = spyOn(component, 'mostrarMensagem');
    component.isEditMode = true;
    component.pessoa = mockPessoa;
    component.form.patchValue({
      nome: 'João Silva Atualizado',
      cpf: '12345678900',
      data_nasc: '1990-01-01',
      sexo: 'M',
      altura: 1.75,
      peso: 70.0
    });

    component.onSubmit();
    fixture.detectChanges();

    expect(pessoaServiceSpy.atualizarPessoa).toHaveBeenCalled();
    expect(mensagemSpy).toHaveBeenCalledWith('Pessoa atualizada com sucesso!', 'sucesso');
    expect(component.loading).toBeFalse();

    setTimeout(() => {
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/pessoa/pesquisar']);
      done();
    }, 2100);
  });

  it('should load person data when in edit mode', () => {
    const mockPessoa: Pessoa = {
      id: 1,
      nome: 'João Silva',
      cpf: '12345678900',
      data_nasc: '1990-01-01',
      sexo: 'M',
      altura: 1.75,
      peso: 70
    };

    pessoaServiceSpy.pesquisarPorCpf.and.returnValue(of(mockPessoa));
    
    component.isEditMode = true;
    component.carregarPessoa('12345678900');
    fixture.detectChanges();

    expect(component.form.get('nome')?.value).toBe(mockPessoa.nome);
    expect(component.form.get('cpf')?.value).toBe(mockPessoa.cpf);
    expect(component.form.get('data_nasc')?.value).toBe(mockPessoa.data_nasc);
    expect(component.form.get('sexo')?.value).toBe(mockPessoa.sexo);
    expect(component.form.get('altura')?.value).toBe(mockPessoa.altura);
    expect(component.form.get('peso')?.value).toBe(mockPessoa.peso);
  });

  it('should handle error when updating person', (done) => {
    const error = new Error('Erro ao atualizar');
    pessoaServiceSpy.atualizarPessoa.and.returnValue(throwError(() => error));
    const consoleSpy = spyOn(console, 'error');
    const mensagemSpy = spyOn(component, 'mostrarMensagem');

    component.isEditMode = true;
    component.pessoa = mockPessoa;
    component.form.patchValue({
      nome: 'João Silva Atualizado',
      cpf: '12345678900',
      data_nasc: '1990-01-01',
      sexo: 'M',
      altura: 1.75,
      peso: 70.0
    });

    component.onSubmit();
    fixture.detectChanges();

    setTimeout(() => {
      fixture.detectChanges();
      expect(consoleSpy).toHaveBeenCalledWith('Erro:', error);
      expect(mensagemSpy).toHaveBeenCalledWith('Erro ao atualizar: ' + error.message, 'erro');
      expect(component.loading).toBeFalse();
      expect(component.error).toBe('Erro ao atualizar pessoa');
      done();
    }, 100);
  });

  it('should cancel and navigate back', () => {
    component.cancelar();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pessoa/pesquisar']);
  });
}); 