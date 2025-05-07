from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from .models import Pessoa
from .serializers import PessoaSerializer
from .tasks import incluir_pessoa, alterar_pessoa, excluir_pessoa, pesquisar_pessoa, calcular_peso_ideal
from .services import PessoaService
from .dto import PessoaDTO, PesoIdealDTO
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

@api_view(['POST'])
def criar_pessoa(request):
    try:
        # Validar formato da data antes de criar o DTO
        if 'data_nasc' in request.data:
            try:
                datetime.strptime(request.data['data_nasc'], '%Y-%m-%d')
            except ValueError:
                return Response(
                    {"data_nasc": ["Data em formato inválido. Use o formato YYYY-MM-DD."]},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        dto = PessoaDTO(**request.data)
        pessoa = PessoaService.criar_pessoa(dto)
        return Response(pessoa.__dict__, status=status.HTTP_201_CREATED)
    except TypeError as e:
        error_msg = str(e)
        if "missing 1 required positional argument: 'nome'" in error_msg:
            return Response({"nome": ["Este campo é obrigatório."]}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except ValueError as e:
        error_msg = str(e)
        if "invalid date format" in error_msg.lower():
            return Response({"data_nasc": ["Data em formato inválido. Use o formato YYYY-MM-DD."]}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        error_msg = str(e)
        if "duplicar valor da chave viola a restrição de unicidade" in error_msg:
            return Response({"cpf": ["CPF já cadastrado."]}, status=status.HTTP_400_BAD_REQUEST)
        logger.error(f"Erro ao criar pessoa: {error_msg}")
        return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def atualizar_pessoa(request, cpf):
    try:
        # Verifica se a pessoa existe
        pessoa_existente = PessoaService.pesquisar_por_cpf(cpf)
        if not pessoa_existente:
            return Response({"error": "Pessoa não encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        # Atualiza os dados com o request
        dados = request.data.copy()
        dados['cpf'] = cpf  # Garante que o CPF na URL seja usado
        
        try:
            # Validar formato da data antes de criar o DTO
            if 'data_nasc' in dados:
                try:
                    datetime.strptime(dados['data_nasc'], '%Y-%m-%d')
                except ValueError:
                    return Response(
                        {"data_nasc": ["Data em formato inválido. Use o formato YYYY-MM-DD."]},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            dto = PessoaDTO(**dados)
            pessoa = PessoaService.atualizar_pessoa(dto)
            return Response(pessoa.__dict__, status=status.HTTP_200_OK)
        except ValueError as e:
            error_msg = str(e)
            if "invalid date format" in error_msg.lower():
                return Response({"data_nasc": ["Data em formato inválido. Use o formato YYYY-MM-DD."]}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Erro ao atualizar pessoa: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def excluir_pessoa(request, cpf):
    try:
        PessoaService.excluir_pessoa(cpf)
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ObjectDoesNotExist:
        return Response({"error": "Pessoa não encontrada"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Erro ao excluir pessoa: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def pesquisar_por_cpf(request, cpf):
    try:
        pessoa = PessoaService.pesquisar_por_cpf(cpf)
        if pessoa:
            return Response(pessoa.__dict__, status=status.HTTP_200_OK)
        return Response({"error": "Pessoa não encontrada"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Erro ao pesquisar pessoa: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def pesquisar_todos(request):
    try:
        logger.info("Iniciando busca de todas as pessoas")
        pessoas = PessoaService.listar_todos()
        logger.info(f"Encontradas {len(pessoas)} pessoas")
        return Response([p.__dict__ for p in pessoas], status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Erro ao listar pessoas: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def calcular_peso_ideal(request, cpf):
    try:
        resultado = PessoaService.calcular_peso_ideal(cpf)
        return Response(resultado.__dict__, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response({"error": "Pessoa não encontrada"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Erro ao calcular peso ideal: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST) 