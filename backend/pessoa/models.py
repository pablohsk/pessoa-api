from django.db import models
from django.core.validators import MinValueValidator

class Pessoa(models.Model):
    nome = models.CharField(max_length=100, verbose_name='Nome')
    data_nasc = models.DateField(verbose_name='Data de Nascimento')
    cpf = models.CharField(max_length=14, unique=True, verbose_name='CPF')
    sexo = models.CharField(max_length=1, choices=[('M', 'Masculino'), ('F', 'Feminino')], verbose_name='Sexo')
    altura = models.FloatField(validators=[MinValueValidator(0.1)], verbose_name='Altura (m)')
    peso = models.FloatField(validators=[MinValueValidator(0.1)], verbose_name='Peso (kg)')

    class Meta:
        db_table = 'pessoa_pessoa'
        ordering = ['nome']
        verbose_name = 'Pessoa'
        verbose_name_plural = 'Pessoas'

    def __str__(self):
        return f"{self.nome} (CPF: {self.cpf})" 