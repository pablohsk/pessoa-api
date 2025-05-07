from dataclasses import dataclass
from datetime import date
from typing import Optional

@dataclass
class PessoaDTO:
    nome: str
    cpf: str
    data_nasc: date
    sexo: str
    altura: float
    peso: float
    id: Optional[int] = None

@dataclass
class PessoaResponseDTO:
    id: int
    nome: str
    cpf: str
    data_nasc: date
    sexo: str
    altura: float
    peso: float
    peso_ideal: Optional[float] = None
    status: Optional[str] = None
    status_peso: Optional[str] = None

@dataclass
class PesoIdealDTO:
    peso_ideal: float
    status: str
    status_peso: str 