# Agrônomo Plus

> **Status:** Funcional

## Arquitetura utilizada

- **Clean Code**
- **DDD**
- **TDD**

## Visão Geral

Agrônomo Plus é uma plataforma digital projetada para ajudar pequenos produtores rurais a gerenciar suas propriedades de forma mais eficiente. Através da integração de ferramentas de gestão financeira, de estoque e de dados agronômicos, buscamos otimizar os recursos e melhorar a produtividade no campo.

## Funcionalidades

- **Gestão de Propriedades:** Cadastro e controle de propriedades rurais.
- **Gestão de Estoque:** Controle de insumos e produtos.
- **Gestão Financeira:** Relatórios de lucros, gastos e previsões de faturamento.
- **Integração com API:** Comunicação com o backend para manipulação dos dados.
- **Frontend Modular:** Interface responsiva com páginas separadas para Pessoas (com CRUD), Propriedades e Plantios.

## Tecnologias

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios
- **Backend:** .NET Core, Entity Framework Core, PostgreSQL, JWT Authentication
- **Testes:** xUnit

## Pré-requisitos

- .NET 9.0 SDK
- Node.js 18+
- PostgreSQL 12+

## Como Executar

### 1. Configurar o Banco de Dados

- Instale e inicie o PostgreSQL.
- Crie um banco de dados chamado `AgronomoPlus`.
- Atualize a string de conexão em `src/AgronomoPlus.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=AgronomoPlus;Username=seu_usuario;Password=sua_senha"
  }
}
```

### 2. Executar as Migrações do Banco

No diretório raiz do projeto:

```bash
cd src/AgronomoPlus.Api
dotnet ef database update
```

### 3. Executar a API

No diretório raiz do projeto:

```bash
cd src/AgronomoPlus.Api
dotnet run
```

A API estará disponível em `http://localhost:5299` (ou a porta configurada no launchSettings.json).
Swagger: `http://localhost:5299/swagger`

### 4. Executar o Frontend

Em um novo terminal, no diretório raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

### 5. Acessar a Aplicação

- Abra o navegador e vá para `http://localhost:5173`.
- Navegue pelas páginas: Dashboard, Pessoas, Propriedades, Plantios.
- Na página Pessoas, você pode adicionar, editar e excluir usuários.

## Problemas Resolvidos

Durante o desenvolvimento e configuração do projeto, os seguintes problemas foram identificados e corrigidos:

### Backend:
- **Configuração do DbContext:** Corrigido o mapeamento dos modelos no AgroPlusDbContext para corresponder aos nomes corretos (ex: Person em vez de Pessoa).
- **Namespace dos Repositórios:** Corrigido o namespace do PersonRepository para AgronomoPlus.Infrastructure.Repositories.
- **Registro de Serviços:** Adicionado o registro de todos os serviços e repositórios necessários no Program.cs, incluindo PropriedadeService, PlantioService, etc.
- **Configuração de CORS:** Adicionado CORS para permitir requisições do frontend.
- **Migrações do Banco:** Recriadas as migrações para PostgreSQL, garantindo que as tabelas sejam criadas corretamente.
- **Testes:** Todos os 11 testes estão passando, cobrindo os serviços de autenticação, pessoas, propriedades, plantios, etc.
- **Dependências:** Verificado que todas as dependências estão corretas para PostgreSQL.

### Frontend:
- **Dependências Faltantes:** Adicionada a dependência 'axios' no package.json, que estava causando erro de módulo não encontrado.
- **Chave Duplicada:** Removida chave duplicada 'organicMatter' no arquivo soil-analysis-section.tsx, que causava erro de sintaxe JavaScript.
- **Tipos TypeScript:** Instalados @types/react e @types/react-dom para resolver erros de tipos no frontend.
- **Utilitários:** Instalados clsx e tailwind-merge para suportar as classes CSS dinâmicas.

A API agora está pronta para funcionar com PostgreSQL, todos os testes estão passando, e o frontend está funcional sem erros de compilação.

## Estrutura do Projeto

- `src/AgronomoPlus.Api/`: API .NET Core
- `src/AgronomoPlus.Application/`: Lógica de aplicação
- `src/AgronomoPlus.Domain/`: Modelos de domínio
- `src/AgronomoPlus.Infrastructure/`: Acesso a dados
- `src/AgronomoPlus.Tests/`: Testes unitários
- `frontend/`: Aplicação React
