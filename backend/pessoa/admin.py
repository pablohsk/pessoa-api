from django.contrib import admin
from .models import Pessoa

@admin.register(Pessoa)
class PessoaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cpf', 'data_nasc', 'sexo', 'altura', 'peso')
    search_fields = ('nome', 'cpf')
    list_filter = ('sexo',) 