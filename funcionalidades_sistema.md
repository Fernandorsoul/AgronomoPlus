## Funcionalidades e Módulos do Sistema de Gerenciamento Rural

Este documento descreve os principais módulos e funcionalidades implementadas no sistema.

### 1. Módulo de Gerenciamento Financeiro

**Objetivo:** Permitir o registro e acompanhamento das transações financeiras da propriedade, incluindo despesas e receitas, e a geração de relatórios.

**Principais Funcionalidades (Backend - .NET C#):**
- CRUD de Categorias Financeiras (`CategoriasFinanceirasController.cs`, `CategoriaFinanceira.cs`)
- CRUD de Transações Financeiras (`TransacoesFinanceirasController.cs`, `TransacaoFinanceira.cs`)
  - Associação de transações a categorias.
  - Registro de tipo (Receita/Despesa), valor, data e descrição.

**Principais Funcionalidades (Frontend - Angular):**
- Formulário para adicionar/editar transações financeiras (`transaction-form.component.ts`).
- Lista de transações financeiras com filtros e ordenação (`transaction-list.component.ts`).
- Geração de relatório financeiro (resumo de receitas e despesas por período) (`financial-report.component.ts`).
- Serviço para comunicação com a API de backend (`financial.service.ts`).

### 2. Módulo de Análise de Solo e Correção

**Objetivo:** Permitir o registro de dados de análises de solo laboratoriais e calcular recomendações de correção com base nesses dados e na cultura desejada.

**Principais Funcionalidades (Backend - .NET C#):**
- CRUD de Análises de Solo (`AnalisesSoloController.cs`, `AnaliseSolo.cs`).
- Serviço de Cálculo de Correção de Solo (`SoloCorrectionService.cs`, `ISoloCorrectionService.cs`)
  - Lógica para calcular a necessidade de calcário e outros nutrientes com base nos parâmetros da análise e nas recomendações para uma cultura específica (`CulturaRecomendacoes.cs`).

**Principais Funcionalidades (Frontend - Angular):**
- Formulário para inserir dados da análise de solo (`soil-analysis-form.component.ts`).
- Exibição dos resultados da análise e das recomendações de correção (`soil-correction-result.component.ts`).
- Serviço para comunicação com a API de backend (`soil-analysis.service.ts`).

### 3. Módulo de Previsão de Colheita

**Objetivo:** Permitir o registro de dados históricos de colheitas e visualizar previsões futuras em gráficos para auxiliar no planejamento.

**Principais Funcionalidades (Backend - .NET C#):**
- CRUD de Dados Históricos de Colheita (`DadosHistoricosColheitaController.cs`, `DadosHistoricosColheita.cs`).
- Serviço de Previsão de Colheita (`PrevisaoColheitaService.cs`)
  - Lógica para gerar previsões (atualmente pode ser uma lógica simples ou placeholder, dependendo da complexidade implementada).

**Principais Funcionalidades (Frontend - Angular):**
- Formulário para inserir dados históricos de colheita (`harvest-data-form.component.ts`).
- Exibição das previsões de colheita em formato de gráfico (`harvest-prediction-chart.component.ts`).
- Serviço para comunicação com a API de backend (`harvest.service.ts`).

### 4. Módulo de Gerenciamento de Animais e Controle Sanitário

**Objetivo:** Permitir o cadastro e acompanhamento de animais, controle de vacinas, medicamentos e ocorrências sanitárias, além de gerar alertas para manejos.

**Principais Funcionalidades (Backend - .NET C#):**
- CRUD de Animais (`AnimaisController.cs`, `Animal.cs`).
- CRUD de Registros de Vacinas/Medicamentos (sub-recurso de Animal, gerenciado via `RegistrosSanitariosController.cs` ou métodos em `AnimaisController.cs`, `RegistroVacinaMedicamento.cs`).
- CRUD de Ocorrências Sanitárias (sub-recurso de Animal, gerenciado via `RegistrosSanitariosController.cs` ou métodos em `AnimaisController.cs`, `OcorrenciaSanitaria.cs`).
- Geração de Alertas Sanitários (`AlertasSanitariosController.cs`, `AlertaSanitarioService.cs`)
  - Lógica para identificar animais com vacinas/medicamentos próximos do vencimento ou outras necessidades de manejo.

**Principais Funcionalidades (Frontend - Angular):**
- Lista de animais cadastrados com filtros (`animal-list.component.ts`).
- Formulário para adicionar/editar dados de animais (`animal-form.component.ts`).
- Visualização detalhada de um animal, incluindo seus registros sanitários (vacinas, ocorrências) (`animal-detail.component.ts`).
- Exibição de alertas sanitários (`sanitary-alerts.component.ts`).
- Serviço para comunicação com a API de backend (`animal.service.ts`).

### Estrutura Geral e Tecnologias

- **Backend:** .NET C# (ASP.NET Core Web API), Entity Framework Core, PostgreSQL.
- **Frontend:** Angular, TypeScript, SCSS.
- **Comunicação:** API RESTful.

