from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date
from ..models import Pessoa

class PessoaViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.pessoa_data = {
            'nome': 'João Silva',
            'cpf': '12345678900',
            'data_nasc': '1990-01-01',
            'sexo': 'M',
            'altura': 1.75,
            'peso': 70.0
        }
        
        # Criar uma pessoa para testes
        self.pessoa = Pessoa.objects.create(
            nome='Maria Santos',
            cpf='98765432100',
            data_nasc=date(1992, 5, 15),
            sexo='F',
            altura=1.65,
            peso=55.0
        )

    def test_criar_pessoa(self):
        url = reverse('backend.pessoa:pessoa-criar')
        response = self.client.post(url, self.pessoa_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Pessoa.objects.count(), 2)
        self.assertEqual(Pessoa.objects.get(cpf='12345678900').nome, 'João Silva')

    def test_criar_pessoa_cpf_duplicado(self):
        # Criar pessoa com CPF duplicado
        url = reverse('backend.pessoa:pessoa-criar')
        self.pessoa_data['cpf'] = self.pessoa.cpf
        response = self.client.post(url, self.pessoa_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_atualizar_pessoa(self):
        url = reverse('backend.pessoa:pessoa-atualizar', args=[self.pessoa.cpf])
        dados_atualizados = {
            'nome': 'Maria Santos Atualizada',
            'cpf': self.pessoa.cpf,
            'data_nasc': '1992-05-15',
            'sexo': 'F',
            'altura': 1.65,
            'peso': 55.0
        }
        response = self.client.put(url, dados_atualizados, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Pessoa.objects.get(cpf=self.pessoa.cpf).nome, 'Maria Santos Atualizada')

    def test_excluir_pessoa(self):
        url = reverse('backend.pessoa:pessoa-excluir', args=[self.pessoa.cpf])
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Pessoa.objects.count(), 0)

    def test_pesquisar_por_cpf(self):
        url = reverse('backend.pessoa:pessoa-pesquisar', args=[self.pessoa.cpf])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['cpf'], self.pessoa.cpf)

    def test_pesquisar_por_cpf_nao_encontrado(self):
        url = reverse('backend.pessoa:pessoa-pesquisar', args=['00000000000'])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_listar_todos(self):
        url = reverse('backend.pessoa:pessoa-listar')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_calcular_peso_ideal(self):
        url = reverse('backend.pessoa:pessoa-peso-ideal', args=[self.pessoa.cpf])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('peso_ideal', response.data)
        self.assertIn('status', response.data)
        self.assertIn('status_peso', response.data)

    def test_calcular_peso_ideal_pessoa_nao_encontrada(self):
        url = reverse('backend.pessoa:pessoa-peso-ideal', args=['00000000000'])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_validacao_dados_obrigatorios(self):
        url = reverse('backend.pessoa:pessoa-criar')
        # Remover campo obrigatório
        self.pessoa_data.pop('nome')
        response = self.client.post(url, self.pessoa_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('nome', response.data)

    def test_validacao_formato_data(self):
        url = reverse('backend.pessoa:pessoa-criar')
        # Data em formato inválido
        self.pessoa_data['data_nasc'] = '01-01-1990'
        response = self.client.post(url, self.pessoa_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('data_nasc', response.data) 