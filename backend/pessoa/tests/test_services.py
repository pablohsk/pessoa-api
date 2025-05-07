from django.test import TestCase
from datetime import date
from ..models import Pessoa
from ..services import PessoaService
from ..dto import PessoaDTO, PesoIdealDTO

class PessoaServiceTest(TestCase):
    def setUp(self):
        # Criar dados de teste
        self.pessoa_dto = PessoaDTO(
            nome="João Silva",
            cpf="12345678900",
            data_nasc=date(1990, 1, 1),
            sexo="M",
            altura=1.75,
            peso=70.0
        )
        
        self.pessoa_dto_feminino = PessoaDTO(
            nome="Maria Santos",
            cpf="98765432100",
            data_nasc=date(1992, 5, 15),
            sexo="F",
            altura=1.65,
            peso=55.0
        )

    def test_criar_pessoa(self):
        # Testar criação de pessoa
        pessoa = PessoaService.criar_pessoa(self.pessoa_dto)
        
        self.assertEqual(pessoa.nome, self.pessoa_dto.nome)
        self.assertEqual(pessoa.cpf, self.pessoa_dto.cpf)
        self.assertEqual(pessoa.sexo, self.pessoa_dto.sexo)
        self.assertEqual(pessoa.altura, self.pessoa_dto.altura)
        self.assertEqual(pessoa.peso, self.pessoa_dto.peso)

    def test_atualizar_pessoa(self):
        # Criar pessoa primeiro
        pessoa = PessoaService.criar_pessoa(self.pessoa_dto)
        
        # Atualizar dados
        self.pessoa_dto.id = pessoa.id
        self.pessoa_dto.nome = "João Silva Atualizado"
        self.pessoa_dto.peso = 75.0
        
        pessoa_atualizada = PessoaService.atualizar_pessoa(self.pessoa_dto)
        
        self.assertEqual(pessoa_atualizada.nome, "João Silva Atualizado")
        self.assertEqual(pessoa_atualizada.peso, 75.0)

    def test_excluir_pessoa(self):
        # Criar pessoa primeiro
        pessoa = PessoaService.criar_pessoa(self.pessoa_dto)
        
        # Excluir pessoa
        PessoaService.excluir_pessoa(pessoa.cpf)
        
        # Verificar se foi excluída
        self.assertFalse(Pessoa.objects.filter(cpf=pessoa.cpf).exists())

    def test_pesquisar_por_cpf(self):
        # Criar pessoa primeiro
        pessoa = PessoaService.criar_pessoa(self.pessoa_dto)
        
        # Pesquisar pessoa
        pessoa_encontrada = PessoaService.pesquisar_por_cpf(pessoa.cpf)
        
        self.assertIsNotNone(pessoa_encontrada)
        self.assertEqual(pessoa_encontrada.cpf, pessoa.cpf)

    def test_listar_todos(self):
        # Criar duas pessoas
        PessoaService.criar_pessoa(self.pessoa_dto)
        PessoaService.criar_pessoa(self.pessoa_dto_feminino)
        
        # Listar todas as pessoas
        pessoas = PessoaService.listar_todos()
        
        self.assertEqual(len(pessoas), 2)

    def test_calcular_peso_ideal_masculino(self):
        # Criar pessoa masculina
        pessoa = PessoaService.criar_pessoa(self.pessoa_dto)
        
        # Calcular peso ideal
        resultado = PessoaService.calcular_peso_ideal(pessoa.cpf)
        
        # Fórmula para homens: (72.7 * altura) - 58
        peso_ideal_esperado = round((72.7 * pessoa.altura) - 58, 2)
        self.assertEqual(resultado.peso_ideal, peso_ideal_esperado)

    def test_calcular_peso_ideal_feminino(self):
        # Criar pessoa feminina
        pessoa = PessoaService.criar_pessoa(self.pessoa_dto_feminino)
        
        # Calcular peso ideal
        resultado = PessoaService.calcular_peso_ideal(pessoa.cpf)
        
        # Fórmula para mulheres: (62.1 * altura) - 44.7
        peso_ideal_esperado = round((62.1 * pessoa.altura) - 44.7, 2)
        self.assertEqual(resultado.peso_ideal, peso_ideal_esperado)

    def test_status_peso_adequado(self):
        # Criar pessoa com peso adequado (dentro de 2kg do ideal)
        pessoa = PessoaService.criar_pessoa(self.pessoa_dto)
        resultado = PessoaService.calcular_peso_ideal(pessoa.cpf)
        
        self.assertEqual(resultado.status_peso, "adequado")

    def test_status_peso_acima(self):
        # Criar pessoa com peso acima do ideal
        self.pessoa_dto.peso = 100.0  # Peso bem acima do ideal
        pessoa = PessoaService.criar_pessoa(self.pessoa_dto)
        resultado = PessoaService.calcular_peso_ideal(pessoa.cpf)
        
        self.assertEqual(resultado.status_peso, "acima")

    def test_status_peso_abaixo(self):
        # Criar pessoa com peso abaixo do ideal
        self.pessoa_dto.peso = 40.0  # Peso bem abaixo do ideal
        pessoa = PessoaService.criar_pessoa(self.pessoa_dto)
        resultado = PessoaService.calcular_peso_ideal(pessoa.cpf)
        
        self.assertEqual(resultado.status_peso, "abaixo") 