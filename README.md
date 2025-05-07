# Sistema de Gestão de Pessoas com Cálculo de Peso Ideal

## 📋 Sobre o Projeto

Este é um sistema completo de gestão de pessoas que permite cadastrar, consultar, atualizar e excluir registros de pessoas, além de calcular automaticamente o peso ideal baseado em características físicas. O sistema foi desenvolvido utilizando as melhores práticas de desenvolvimento e tecnologias modernas.

### 🎯 Objetivos

- Criar uma aplicação full-stack robusta e escalável
- Implementar boas práticas de desenvolvimento
- Demonstrar conhecimento em arquitetura de software
- Criar uma interface intuitiva e responsiva
- Implementar validações e tratamentos de erros
- Documentar todo o processo de desenvolvimento

## 🚀 Tecnologias Utilizadas

### Backend
- Python 3.11+
- Django 5.2
- Django REST Framework
- PostgreSQL
- Psycopg2
- Django CORS Headers

### Frontend
- Angular 17
- TypeScript
- Bootstrap 5
- RxJS
- Angular Router
- Angular Forms (Reactive Forms)

## 🛠️ Pré-requisitos

- Python 3.11 ou superior
- Node.js 18 ou superior
- PostgreSQL 15 ou superior
- Git

## 🔧 Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/pessoa-api.git
cd pessoa-api
```

### 2. Configuração do Backend

#### 2.1. Crie e ative um ambiente virtual
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

#### 2.2. Instale as dependências do Python
```bash
pip install -r requirements.txt
```

#### 2.3. Configure o Banco de Dados
- Crie um banco de dados PostgreSQL chamado `pessoa_db`
- Configure as credenciais no arquivo `backend/settings.py`

#### 2.4. Execute as migrações
```bash
python manage.py migrate
```

#### 2.5. Inicie o servidor Django
```bash
python manage.py runserver
```

### 3. Configuração do Frontend

#### 3.1. Instale as dependências do Node
```bash
cd frontend
npm install
```

#### 3.2. Inicie o servidor Angular
```bash
ng serve
```

## 📦 Estrutura do Projeto

```
pessoa-api/
├── backend/
│   ├── pessoa/
│   │   ├── models.py      # Modelo de dados
│   │   ├── views.py       # Lógica de negócios
│   │   ├── urls.py        # Rotas da API
│   │   └── serializers.py # Serialização de dados
│   └── settings.py        # Configurações Django
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/    # Componentes Angular
    │   │   ├── services/      # Serviços de API
    │   │   └── models/        # Interfaces TypeScript
    │   └── assets/           # Recursos estáticos
    └── angular.json          # Configuração Angular
```

## 💡 Funcionalidades

### Gestão de Pessoas
- Cadastro completo de pessoas
- Consulta por CPF
- Listagem com filtros
- Atualização de dados
- Exclusão de registros

### Cálculo de Peso Ideal
- Cálculo automático baseado em:
  - Sexo
  - Altura
  - Fórmula específica para cada gênero
- Feedback visual do status do peso
- Histórico de cálculos

### Interface Intuitiva
- Design responsivo
- Feedback visual de ações
- Validações em tempo real
- Mensagens de erro amigáveis
- Navegação intuitiva

## 🔒 Segurança

- Validação de dados no backend
- Proteção contra CSRF
- Configuração de CORS
- Sanitização de inputs
- Tratamento de exceções

## 🧪 Testes

O projeto inclui testes automatizados para garantir a qualidade do código:

### Backend
```bash
python manage.py test
```

### Frontend
```bash
ng test
```

## 📈 Desafios e Soluções

### 1. Arquitetura Standalone do Angular
**Desafio**: Migração para componentes standalone no Angular 17
**Solução**: Implementação de uma arquitetura modular com lazy loading

### 2. Integração Backend-Frontend
**Desafio**: Configuração de CORS e CSRF
**Solução**: Implementação de middleware personalizado e configuração adequada

### 3. Cálculo de Peso Ideal
**Desafio**: Implementação de fórmulas específicas por gênero
**Solução**: Criação de um serviço dedicado com validações

### 4. Performance
**Desafio**: Otimização de consultas ao banco
**Solução**: Implementação de índices e queries otimizadas

## 🚀 Melhorias Futuras

1. Implementação de autenticação JWT
2. Sistema de logs mais robusto
3. Cache de consultas frequentes
4. Testes de integração
5. CI/CD com GitHub Actions
6. Containerização com Docker
7. Monitoramento com Prometheus/Grafana

---

Desenvolvido com ❤️ por Pablo Fidelis Dias 
