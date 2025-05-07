from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from .models import Pessoa
from .serializers import PessoaSerializer
from .tasks import incluir_pessoa, alterar_pessoa, excluir_pessoa, pesquisar_pessoa, calcular_peso_ideal
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def incluir(request):
    try:
        pessoa = incluir_pessoa(request.data)
        serializer = PessoaSerializer(pessoa)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'erro': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def alterar(request, cpf):
    try:
        pessoa = alterar_pessoa(cpf, request.data)
        serializer = PessoaSerializer(pessoa)
        return Response(serializer.data)
    except Exception as e:
        return Response({'erro': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def excluir(request, cpf):
    try:
        excluir_pessoa(cpf)
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'erro': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def pesquisar(request, cpf):
    try:
        pessoa = pesquisar_pessoa(cpf)
        serializer = PessoaSerializer(pessoa)
        return Response(serializer.data)
    except Exception as e:
        return Response({'erro': str(e)}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def pesquisar_todos(request):
    try:
        logger.info("Iniciando busca de todas as pessoas")
        pessoas = Pessoa.objects.all()
        logger.info(f"Encontradas {pessoas.count()} pessoas")
        serializer = PessoaSerializer(pessoas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Erro ao buscar pessoas: {str(e)}")
        return Response({'erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def peso_ideal(request, cpf):
    try:
        peso = calcular_peso_ideal(cpf)
        return Response({'peso_ideal': peso})
    except Exception as e:
        return Response({'erro': str(e)}, status=status.HTTP_400_BAD_REQUEST) 