from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from . import views

urlpatterns = [
    path('incluir/', csrf_exempt(views.incluir)),
    path('alterar/<str:cpf>/', csrf_exempt(views.alterar)),
    path('excluir/<str:cpf>/', csrf_exempt(views.excluir)),
    path('pesquisar/', csrf_exempt(views.pesquisar_todos)),
    path('pesquisar/<str:cpf>/', csrf_exempt(views.pesquisar)),
    path('peso-ideal/<str:cpf>/', csrf_exempt(views.peso_ideal)),
] 