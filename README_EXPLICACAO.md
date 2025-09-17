# Explicação Técnica

## Visão Geral da Arquitetura
- **Serviços**:
  - `produtos`: Node.js + Express + SQLite (porta 5001)
  - `clientes`: Python + FastAPI + SQLite (porta 5002)
  - `vendas`: Node.js + Express + SQLite (porta 5003)
  - `frontend`: HTML/JS servido por Nginx (porta 8080)
- **Orquestração**: Docker Compose, cada serviço em seu container, rede Docker compartilhada.
- **Comunicação**: HTTP REST entre serviços; o `frontend` acessa as APIs via Nginx (proxy `/api/*`).

## Modelagem de Dados (SQLite em cada serviço)
- Produtos: `id, nome, descricao, valor`
- Clientes: `id, nome, telefone`
- Vendas: `id, cliente_id, produto_id, quantidade, criado_em`

Cada serviço possui seu banco SQLite isolado (responsabilidade única, baixo acoplamento). `vendas` pode opcionalmente validar IDs consultando `clientes` e `produtos` (pode ser desligado via variável de ambiente).

## Endpoints Principais
- Produtos (5001): `GET /health`, `GET /produtos`, `POST /produtos`
- Clientes (5002): `GET /health`, `GET /clientes`, `POST /clientes`
- Vendas (5003): `GET /health`, `GET /vendas`, `POST /vendas`
- Frontend (8080):
  - `/` (UI)
  - Proxy: `/api/produtos`, `/api/clientes`, `/api/vendas`

## Decisões Técnicas
- **Variedade de tecnologias**: Node.js (2 serviços), Python/FastAPI (1 serviço), Frontend em HTML/JS (sem framework para agilidade) — cumpre o requisito de não usar a mesma tech em >2 serviços.
- **SQLite**: leve, zero-config e suficiente para o escopo; simplifica execução em Docker.
- **Express + better-sqlite3**: driver síncrono e simples; bom para endpoints CRUD rápidos.
- **FastAPI**: produtividade e validação de entrada via Pydantic; performance boa.
- **Nginx**: serve estáticos e faz proxy para APIs por nome de serviço na rede Docker.
- **Docker Compose**: simplifica subir todo o stack com um comando.

## Fluxo de Requisições
1. Usuário interage no `frontend` (formularios simples) → `fetch` para `/api/...` no Nginx.
2. Nginx redireciona:
   - `/api/produtos` → `produtos:5001`
   - `/api/clientes` → `clientes:5002`
   - `/api/vendas` → `vendas:5003`
3. `vendas` grava a venda. Se a validação estiver ativa, faz chamadas HTTP para `clientes` e `produtos` antes de inserir.

## Conformidade com os Requisitos
- Programação distribuída: microserviços independentes + comunicação HTTP.
- Docker obrigatório: cada serviço com `Dockerfile` e orquestração via `docker-compose.yml`.
- Variedade de linguagens/frameworks: Node (2), Python/FastAPI (1), Frontend sem framework pesado.
- Repositório público com instruções: `README.md` explica como subir tudo com `docker compose up`.

## Como Demonstrar ao Professor (roteiro rápido)
1. Mostrar `docker-compose.yml` com 4 serviços e portas.
2. Subir: `docker compose up --build`.
3. Abrir `http://localhost:8080` e:
   - Cadastrar 1 produto e 1 cliente.
   - Registrar uma venda usando os IDs cadastrados.
   - Listar produtos, clientes e vendas na própria UI.
4. Mostrar endpoints de saúde (`/health`) funcionando.
5. Explicar que cada serviço tem seu próprio SQLite (isolamento) e que `vendas` pode validar IDs via chamadas aos outros serviços.

## Variáveis de Ambiente Importantes
- `vendas`:
  - `CLIENTES_URL` (padrão: `http://clientes:5002`)
  - `PRODUTOS_URL` (padrão: `http://produtos:5001`)
  - `VALIDA_IDS` (padrão: diferente de `false` → valida; defina `false` para desativar)

## Observações de Operação
- Os arquivos `.db` ficam dentro dos containers; ao parar/remover, os dados são descartados (não há persistência em volume por simplicidade).
- Para persistir, seria possível mapear volumes Docker para os diretórios dos bancos.
- CORS: habilitado nos serviços Node; no FastAPI não é necessário pois a UI passa pelo Nginx (mesma origem em produção Docker).

## Possíveis Melhorias Futuras
- Persistência com volumes e migrações de esquema.
- Autenticação simples (JWT) caso necessário.
- Paginação nas listagens.
- Validação de IDs com cache ou via eventos/filas.
- Observabilidade (logs estruturados, métricas, traço distribuído).
- Testes automatizados (unitários e de contrato entre serviços).

## Limitações Conhecidas
- Sem transações distribuídas: a venda não confirma com consistência forte entre serviços (trade-off de simplicidade).
- Sem retries/circuit breaker na validação: se `clientes`/`produtos` estiverem fora do ar, `vendas` retorna erro.

## Estrutura de Pastas (resumo)
- `produtos/` → Node, Express, SQLite, Dockerfile
- `clientes/` → FastAPI, SQLite, Dockerfile
- `vendas/` → Node, Express, SQLite, Dockerfile
- `frontend/` → Nginx, HTML, CSS, JS, Dockerfile
- `docker-compose.yml` → orquestração
- `README.md` → como executar
- `README_EXPLICACAO.md` → (este documento)
