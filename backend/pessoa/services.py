from typing import List, Optional
from .models import Pessoa
from .dto import PessoaDTO, PessoaResponseDTO, PesoIdealDTO

class PessoaService:
    @staticmethod
    def criar_pessoa(dto: PessoaDTO) -> PessoaResponseDTO:
        pessoa = Pessoa.objects.create(
            nome=dto.nome,
            cpf=dto.cpf,
            data_nasc=dto.data_nasc,
            sexo=dto.sexo,
            altura=dto.altura,
            peso=dto.peso
        )
        return PessoaResponseDTO(
            id=pessoa.id,
            nome=pessoa.nome,
            cpf=pessoa.cpf,
            data_nasc=pessoa.data_nasc,
            sexo=pessoa.sexo,
            altura=pessoa.altura,
            peso=pessoa.peso
        )

    @staticmethod
    def atualizar_pessoa(dto: PessoaDTO) -> PessoaResponseDTO:
        pessoa = Pessoa.objects.get(cpf=dto.cpf)
        pessoa.nome = dto.nome
        pessoa.data_nasc = dto.data_nasc
        pessoa.sexo = dto.sexo
        pessoa.altura = dto.altura
        pessoa.peso = dto.peso
        pessoa.save()
        return PessoaResponseDTO(
            id=pessoa.id,
            nome=pessoa.nome,
            cpf=pessoa.cpf,
            data_nasc=pessoa.data_nasc,
            sexo=pessoa.sexo,
            altura=pessoa.altura,
            peso=pessoa.peso
        )

    @staticmethod
    def excluir_pessoa(cpf: str) -> None:
        Pessoa.objects.filter(cpf=cpf).delete()

    @staticmethod
    def pesquisar_por_cpf(cpf: str) -> Optional[PessoaResponseDTO]:
        try:
            pessoa = Pessoa.objects.get(cpf=cpf)
            return PessoaResponseDTO(
                id=pessoa.id,
                nome=pessoa.nome,
                cpf=pessoa.cpf,
                data_nasc=pessoa.data_nasc,
                sexo=pessoa.sexo,
                altura=pessoa.altura,
                peso=pessoa.peso
            )
        except Pessoa.DoesNotExist:
            return None

    @staticmethod
    def listar_todos() -> List[PessoaResponseDTO]:
        pessoas = Pessoa.objects.all()
        return [
            PessoaResponseDTO(
                id=p.id,
                nome=p.nome,
                cpf=p.cpf,
                data_nasc=p.data_nasc,
                sexo=p.sexo,
                altura=p.altura,
                peso=p.peso
            )
            for p in pessoas
        ]

    @staticmethod
    def calcular_peso_ideal(cpf: str) -> PesoIdealDTO:
        pessoa = Pessoa.objects.get(cpf=cpf)
        if pessoa.sexo == 'M':
            peso_ideal = (72.7 * pessoa.altura) - 58
        else:
            peso_ideal = (62.1 * pessoa.altura) - 44.7
        
        diferenca = pessoa.peso - peso_ideal
        if abs(diferenca) <= 2:  # Margem de 2kg para considerar peso adequado
            status = "Peso adequado"
            status_peso = "adequado"
        elif diferenca > 0:
            status = "Acima do peso ideal"
            status_peso = "acima"
        else:
            status = "Abaixo do peso ideal"
            status_peso = "abaixo"
        
        return PesoIdealDTO(
            peso_ideal=round(peso_ideal, 2),
            status=status,
            status_peso=status_peso
        ) 