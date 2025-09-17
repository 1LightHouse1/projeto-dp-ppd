# 🛒 Sistema de Controle de Vendas - Microserviços

Sistema distribuído para controle de vendas desenvolvido com arquitetura de microserviços, utilizando Docker para orquestração e conceitos de programação paralela/distribuída.

## 🚀 Como Executar

### Pré-requisitos
- Docker Desktop instalado e rodando
- Git (opcional, para clonar o repositório)

### Execução Rápida
```bash
# Clone o repositório (se necessário)
git clone <seu-repositorio>
cd projeto-dp-ppd

# Execute todos os serviços
docker compose up --build

# Acesse a aplicação
# Frontend: http://localhost:8080
# APIs: http://localhost:5001, 5002, 5003
```

### Comandos Úteis
```bash
# Parar todos os serviços
docker compose down

# Ver logs de um serviço específico
docker compose logs vendas

# Rebuild apenas um serviço
docker compose build --no-cache frontend
docker compose up -d frontend
```

## 🏗️ Arquitetura do Sistema

### Microserviços
- **Produtos** (Porta 5001) - Node.js + Express + SQLite
- **Clientes** (Porta 5002) - Python + FastAPI + SQLite  
- **Vendas** (Porta 5003) - Node.js + Express + SQLite
- **Frontend** (Porta 8080) - HTML/JS + Bootstrap + Nginx

### Banco de Dados
- **SQLite compartilhado** entre todos os serviços
- **Volume Docker** para persistência de dados
- **Estrutura normalizada** com relacionamentos

## 📡 Endpoints da API

### Produtos (http://localhost:5001)
```bash
# Listar produtos
curl http://localhost:5001/produtos

# Criar produto
curl -X POST http://localhost:5001/produtos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Produto A","descricao":"Descrição","valor":25.50}'

# Health check
curl http://localhost:5001/health
```

### Clientes (http://localhost:5002)
```bash
# Listar clientes
curl http://localhost:5002/clientes

# Criar cliente
curl -X POST http://localhost:5002/clientes \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","telefone":"11999999999"}'

# Health check
curl http://localhost:5002/health
```

### Vendas (http://localhost:5003)
```bash
# Listar vendas
curl http://localhost:5003/vendas

# Criar venda (múltiplos produtos)
curl -X POST http://localhost:5003/vendas \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": 1,
    "produtos": [
      {"produto_id": 1, "quantidade": 2},
      {"produto_id": 2, "quantidade": 1}
    ]
  }'

# Health check
curl http://localhost:5003/health
```

## 🎯 Funcionalidades

### Frontend (SPA)
- **Dashboard** com estatísticas em tempo real
- **Gestão de Produtos** - Cadastro e listagem
- **Gestão de Clientes** - Cadastro e listagem  
- **Gestão de Vendas** - Vendas com múltiplos produtos
- **Interface Responsiva** - Bootstrap + UX moderna
- **Feedback Visual** - Toasts e modais

### Backend
- **APIs RESTful** com validação
- **Banco compartilhado** com integridade referencial
- **Transações atômicas** para vendas
- **Validação de dependências** entre serviços
- **Health checks** para monitoramento

## 🐳 Docker

### Estrutura de Containers
```
projeto-dp-ppd/
├── produtos/          # Serviço Node.js
├── clientes/          # Serviço Python
├── vendas/            # Serviço Node.js
├── frontend/          # Interface Nginx
└── docker-compose.yml # Orquestração
```

### Volumes
- **shared-db**: Banco SQLite compartilhado
- **Persistência**: Dados mantidos entre restarts

## 🔧 Tecnologias Utilizadas

### Backend
- **Node.js 20** - Runtime JavaScript
- **Express** - Framework web
- **Python 3.11** - Linguagem de programação
- **FastAPI** - Framework web assíncrono
- **SQLite** - Banco de dados
- **better-sqlite3** - Driver SQLite otimizado

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos
- **JavaScript ES6+** - Lógica da aplicação
- **Bootstrap 5** - Framework CSS
- **Nginx** - Servidor web e proxy reverso

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Multi-stage builds** - Otimização de imagens

## 📊 Conceitos de Programação Distribuída

### Implementados
- **Microserviços** - Separação de responsabilidades
- **API Gateway** - Nginx como proxy reverso
- **Comunicação HTTP** - REST entre serviços
- **Banco compartilhado** - Estado compartilhado
- **Transações distribuídas** - Atomicidade
- **Health checks** - Monitoramento de serviços
- **Load balancing** - Nginx distribui requisições

### Padrões Utilizados
- **Service Discovery** - Serviços se comunicam por nome
- **Circuit Breaker** - Validação de dependências
- **Event Sourcing** - Log de vendas com histórico
- **CQRS** - Separação de comandos e consultas

## 🚦 Status dos Serviços

```bash
# Verificar status
docker compose ps

# Logs em tempo real
docker compose logs -f

# Testar conectividade
curl http://localhost:8080

## é isso
```