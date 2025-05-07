from rest_framework import serializers
from .models import Pessoa

class PessoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pessoa
        fields = ['id', 'nome', 'data_nasc', 'cpf', 'sexo', 'altura', 'peso']
        read_only_fields = ['id']

    def validate_cpf(self, value):
        if not value or len(value) != 14:
            raise serializers.ValidationError("CPF deve ter 14 caracteres incluindo pontos e traço")
        return value

    def validate_altura(self, value):
        if value <= 0:
            raise serializers.ValidationError("Altura deve ser maior que zero")
        return value

    def validate_peso(self, value):
        if value <= 0:
            raise serializers.ValidationError("Peso deve ser maior que zero")
        return value 