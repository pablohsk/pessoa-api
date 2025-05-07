from rest_framework.exceptions import ValidationError
from .models import Pessoa

def incluir_pessoa(data):
    try:
        pessoa = Pessoa.objects.create(**data)
        return pessoa
    except Exception as e:
        raise ValidationError(f"Erro ao incluir pessoa: {str(e)}")

def alterar_pessoa(cpf, data):
    try:
        pessoa = Pessoa.objects.get(cpf=cpf)
        for key, value in data.items():
            setattr(pessoa, key, value)
        pessoa.save()
        return pessoa
    except Pessoa.DoesNotExist:
        raise ValidationError(f"Pessoa com CPF {cpf} não encontrada")
    except Exception as e:
        raise ValidationError(f"Erro ao alterar pessoa: {str(e)}")

def excluir_pessoa(cpf):
    try:
        pessoa = Pessoa.objects.get(cpf=cpf)
        pessoa.delete()
    except Pessoa.DoesNotExist:
        raise ValidationError(f"Pessoa com CPF {cpf} não encontrada")
    except Exception as e:
        raise ValidationError(f"Erro ao excluir pessoa: {str(e)}")

def pesquisar_pessoa(cpf):
    try:
        pessoa = Pessoa.objects.get(cpf=cpf)
        return pessoa
    except Pessoa.DoesNotExist:
        raise ValidationError(f"Pessoa com CPF {cpf} não encontrada")
    except Exception as e:
        raise ValidationError(f"Erro ao pesquisar pessoa: {str(e)}")

def calcular_peso_ideal(cpf):
    try:
        pessoa = Pessoa.objects.get(cpf=cpf)
        if pessoa.sexo == 'M':
            peso_ideal = (72.7 * pessoa.altura) - 58
        else:
            peso_ideal = (62.1 * pessoa.altura) - 44.7
        return round(peso_ideal, 2)
    except Pessoa.DoesNotExist:
        raise ValidationError(f"Pessoa com CPF {cpf} não encontrada")
    except Exception as e:
        raise ValidationError(f"Erro ao calcular peso ideal: {str(e)}") 