# Projeto DP-PPD  Controle de Vendas com Microserviços

Este projeto implementa uma aplicação distribuída para controle de vendas, composta por 4 serviços:
- Produtos (Node.js + Express + SQLite)  porta 5001
- Clientes (Python + FastAPI + SQLite)  porta 5002
- Vendas (Node.js + Express + SQLite)  porta 5003
- Frontend (HTML/JS + Nginx)  porta 8080

Orquestração via Docker Compose.

## Requisitos
- Docker Desktop instalado e em execução
- Git (opcional, para clonar o repositório)

## Como rodar
1. Clone este repositório ou baixe os arquivos.
2. Na raiz do projeto, execute:

`ash
docker compose up --build
`

3. Acesse o Frontend em:
- http://localhost:8080

4. Serviços (APIs) expostos:
- Produtos: http://localhost:5001
  - GET /health
  - GET /produtos
  - POST /produtos
- Clientes: http://localhost:5002
  - GET /health
  - GET /clientes
  - POST /clientes
- Vendas: http://localhost:5003
  - GET /health
  - GET /vendas
  - POST /vendas

O Frontend usa proxy via Nginx:
- /api/produtos  serviços de Produtos
- /api/clientes  serviços de Clientes
- /api/vendas  serviços de Vendas

## Exemplos de requisições (curl)
Criar produto:
`ash
curl -X POST http://localhost:5001/produtos -H "Content-Type: application/json" -d '{"nome":"Caneta","descricao":"Azul","valor":3.5}'
`

Criar cliente:
`ash
curl -X POST http://localhost:5002/clientes -H "Content-Type: application/json" -d '{"nome":"João","telefone":"9999-9999"}'
`

Criar venda:
`ash
curl -X POST http://localhost:5003/vendas -H "Content-Type: application/json" -d '{"cliente_id":1, "produto_id":1, "quantidade":2}'
`

## Parar os serviços
`ash
docker compose down
`

## Observações
- Os bancos SQLite são criados dentro dos containers de cada serviço.
- A validação de IDs no serviço de Vendas pode ser desativada com VALAIDA_IDS=false (ajuste no Dockerfile/compose se necessário).
- Se mudar as portas locais, ajuste o docker-compose.yml e o 
ginx.conf do frontend.
