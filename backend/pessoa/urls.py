from django.urls import path
from . import views

app_name = 'backend.pessoa'

urlpatterns = [
    path('criar/', views.criar_pessoa, name='pessoa-criar'),
    path('atualizar/<str:cpf>/', views.atualizar_pessoa, name='pessoa-atualizar'),
    path('excluir/<str:cpf>/', views.excluir_pessoa, name='pessoa-excluir'),
    path('pesquisar/<str:cpf>/', views.pesquisar_por_cpf, name='pessoa-pesquisar'),
    path('pesquisar/', views.pesquisar_todos, name='pessoa-listar'),
    path('peso-ideal/<str:cpf>/', views.calcular_peso_ideal, name='pessoa-peso-ideal'),
] 