# 🎯 Guia de Apresentação - Slides para Professor

## 📋 Estrutura Recomendada dos Slides

### **Slide 1: Capa**
```
🛒 Sistema de Controle de Vendas
   Microserviços com Docker

Desenvolvido por: [Seu Nome]
Disciplina: Programação Paralela e Distribuída (PPD)
Professor: [Nome do Professor]
Data: Setembro 2025
```

### **Slide 2: Agenda**
```
📚 O que será apresentado:

1. 🎯 Objetivo do Projeto
2. 🏗️ Arquitetura de Microserviços
3. 🐳 Containerização com Docker
4. 🗄️ Banco de Dados Compartilhado
5. 🔄 Comunicação Entre Serviços
6. 💻 Demonstração Prática
7. 📊 Conceitos de Programação Distribuída
8. 🚀 Resultados e Conclusões
```

### **Slide 3: Objetivo do Projeto**
```
🎯 Desenvolver uma aplicação distribuída para controle de vendas

✅ Requisitos Atendidos:
• 4 microserviços (Produtos, Clientes, Vendas, Frontend)
• Conceitos de programação paralela/distribuída
• Docker para orquestração
• Tecnologias variadas (Node.js, Python, HTML/JS)
• Banco de dados compartilhado
• Interface moderna e responsiva
```

### **Slide 4: Arquitetura Geral**
```
🏗️ Arquitetura de Microserviços

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │  Microserviços │    │   Banco de  │
│   (Nginx)   │    │                 │    │   Dados     │
│   Port: 8080│    │                 │    │   (SQLite)  │
└─────────────┘    └─────────────────┘    └─────────────┘
         │                       │                       │
         │              ┌────────┼────────┐              │
         │              │        │        │              │
         │              ▼        ▼        ▼              │
         │    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
         │    │  Produtos   │ │  Clientes   │ │   Vendas    │
         │    │  (Node.js)  │ │  (Python)   │ │  (Node.js)  │
         │    │  Port: 5001 │ │  Port: 5002 │ │  Port: 5003 │
         │    └─────────────┘ └─────────────┘ └─────────────┘
```

### **Slide 5: Tecnologias Utilizadas**
```
🔧 Stack Tecnológico

Backend:
• Node.js 20 + Express (Produtos e Vendas)
• Python 3.11 + FastAPI (Clientes)
• SQLite + better-sqlite3

Frontend:
• HTML5 + CSS3 + JavaScript ES6+
• Bootstrap 5 + Nginx

DevOps:
• Docker + Docker Compose
• Volumes compartilhados
• Proxy reverso
```

### **Slide 6: Docker - Containerização**
```
🐳 Como o Docker Funciona

Conceitos Implementados:
• Containers isolados para cada serviço
• Rede interna para comunicação
• Volumes compartilhados para persistência
• Orquestração com Docker Compose

Benefícios:
✅ Isolamento de ambientes
✅ Portabilidade entre sistemas
✅ Escalabilidade horizontal
✅ Versionamento de dependências
```

### **Slide 7: Estrutura do Banco de Dados**
```
🗄️ SQLite Compartilhado

Tabelas:
• produtos (id, nome, descricao, valor)
• clientes (id, nome, telefone)
• vendas (id, cliente_id, criado_em)
• venda_itens (id, venda_id, produto_id, quantidade)

Características:
• Banco único compartilhado entre serviços
• Integridade referencial com Foreign Keys
• Transações ACID para consistência
• Volume Docker para persistência
```

### **Slide 8: Comunicação Entre Serviços**
```
🔄 Padrões de Comunicação

1. Frontend ↔ APIs: HTTP REST
2. APIs ↔ Banco: SQL direto
3. Vendas ↔ Outras APIs: Validação HTTP
4. Service Discovery: Nomes de containers
5. Shared Database: Estado compartilhado

Exemplo de Código:
```javascript
// Validação entre serviços
const [cliRes, prodRes] = await Promise.all([
  fetch('http://clientes:5002/clientes'),
  fetch('http://produtos:5001/produtos')
]);
```
```

### **Slide 9: Conceitos de Programação Distribuída**
```
📊 Conceitos Implementados

✅ Microserviços
   Separação de responsabilidades

✅ Service Discovery
   Comunicação por nome de containers

✅ API Gateway
   Nginx como proxy reverso

✅ Shared Database
   Estado compartilhado entre serviços

✅ Transações Distribuídas
   Atomicidade com SQLite

✅ Health Checks
   Monitoramento de disponibilidade
```

### **Slide 10: Demonstração Prática**
```
💻 Vamos ver funcionando!

1. 🚀 Executar: docker compose up --build
2. 🌐 Acessar: http://localhost:8080
3. 📦 Cadastrar produtos
4. 👥 Cadastrar clientes
5. 🛒 Criar venda com múltiplos produtos
6. 📊 Visualizar dashboard com estatísticas
7. 🔄 Mostrar responsividade da interface
```

### **Slide 11: Código Relevante - Docker Compose**
```
🐳 docker-compose.yml

```yaml
services:
  produtos:
    build: ./produtos
    ports: ["5001:5001"]
    volumes: [shared-db:/data]
  
  clientes:
    build: ./clientes
    ports: ["5002:5002"]
    volumes: [shared-db:/data]
  
  vendas:
    build: ./vendas
    ports: ["5003:5003"]
    depends_on: [produtos, clientes]
    volumes: [shared-db:/data]
    environment:
      - CLIENTES_URL=http://clientes:5002/clientes
      - PRODUTOS_URL=http://produtos:5001/produtos
```
```

### **Slide 12: Código Relevante - API de Vendas**
```
🛒 vendas/src/server.js

```javascript
// Criação de venda com múltiplos produtos
app.post('/vendas', async (req, res) => {
  const { cliente_id, produtos } = req.body;
  
  // Validação de dependências
  const [cliRes, prodRes] = await Promise.all([
    fetch(process.env.CLIENTES_URL),
    fetch(process.env.PRODUTOS_URL)
  ]);
  
  // Transação atômica
  const transaction = db.transaction(() => {
    const venda = insertVenda.run(cliente_id);
    for (const produto of produtos) {
      insertItem.run(venda.lastInsertRowid, 
                    produto.produto_id, 
                    produto.quantidade);
    }
  });
  
  transaction();
});
```
```

### **Slide 13: Código Relevante - Frontend SPA**
```
🌐 frontend/src/main.js

```javascript
// Requisições paralelas para dashboard
async function loadStats() {
  const [produtos, clientes, vendas] = await Promise.all([
    api.produtos.list(),
    api.clientes.list(),
    api.vendas.list()
  ]);
  
  document.getElementById('total-produtos').textContent = produtos.length;
  document.getElementById('total-clientes').textContent = clientes.length;
  document.getElementById('total-vendas').textContent = vendas.length;
}

// Interface para múltiplos produtos
function adicionarProduto() {
  const container = document.getElementById('produtos-container');
  // Adiciona novo item de produto dinamicamente
}
```
```

### **Slide 14: Código Relevante - Estrutura do Banco**
```
🗄️ Estrutura SQL

```sql
-- Tabela de vendas
CREATE TABLE vendas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id INTEGER NOT NULL,
  criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de itens da venda
CREATE TABLE venda_itens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  venda_id INTEGER NOT NULL,
  produto_id INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  FOREIGN KEY (venda_id) REFERENCES vendas (id) ON DELETE CASCADE
);

-- Consulta com JOIN
SELECT v.*, GROUP_CONCAT(vi.produto_id || ':' || vi.quantidade) as itens
FROM vendas v
LEFT JOIN venda_itens vi ON v.id = vi.venda_id
GROUP BY v.id;
```
```

### **Slide 15: Fluxo de Dados Detalhado**
```
📊 Fluxo de Criação de Venda

1. Frontend → Nginx → Vendas API
2. Vendas API → Valida Clientes/Produtos APIs
3. Vendas API → BEGIN TRANSACTION
4. Vendas API → INSERT INTO vendas
5. Vendas API → INSERT INTO venda_itens (múltiplos)
6. Vendas API → COMMIT TRANSACTION
7. Vendas API → Retorna venda com itens
8. Frontend → Atualiza interface
```

### **Slide 16: Monitoramento e Debugging**
```
🔍 Como Monitorar o Sistema

Comandos Docker:
```bash
# Ver status dos containers
docker compose ps

# Ver logs em tempo real
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs vendas

# Acessar banco de dados
docker run --rm -it --volume projeto-dp-ppd_shared-db:/data alpine sh
apk add sqlite && sqlite3 /data/app.db
```

Health Checks:
```bash
curl http://localhost:5001/health
curl http://localhost:5002/health
curl http://localhost:5003/health
```
```

### **Slide 17: Resultados Alcançados**
```
🚀 Resultados do Projeto

✅ Funcionalidades Implementadas:
• Sistema completo de vendas
• Interface moderna e responsiva
• Múltiplos produtos por venda
• Dashboard com estatísticas em tempo real
• Validação entre serviços

✅ Conceitos de PPD Aplicados:
• Microserviços com responsabilidades únicas
• Comunicação assíncrona entre serviços
• Banco de dados compartilhado
• Containerização e orquestração
• Transações distribuídas
```

### **Slide 18: Desafios e Soluções**
```
⚡ Desafios Encontrados

🔴 Problema: Frontend não carregava
✅ Solução: Configuração correta do Nginx

🔴 Problema: Validação entre serviços
✅ Solução: Health checks e tratamento de erros

🔴 Problema: Múltiplos produtos por venda
✅ Solução: Estrutura normalizada com tabela de itens

🔴 Problema: Interface simples
✅ Solução: Bootstrap + SPA + UX moderna
```

### **Slide 19: Melhorias Futuras**
```
🔮 Próximos Passos

Escalabilidade:
• Load Balancer para múltiplas instâncias
• Cache Redis para performance
• Message Queue para comunicação assíncrona

Monitoramento:
• Prometheus + Grafana para métricas
• ELK Stack para logs centralizados
• Jaeger para tracing distribuído

Segurança:
• JWT para autenticação
• HTTPS para comunicação segura
• Rate Limiting para proteção
```

### **Slide 20: Conclusões**
```
🎓 Conclusões

✅ Objetivos Alcançados:
• Aplicação distribuída funcional
• Conceitos de PPD implementados
• Docker para orquestração
• Tecnologias variadas utilizadas
• Interface moderna e responsiva

✅ Aprendizados:
• Arquitetura de microserviços na prática
• Containerização com Docker
• Comunicação entre serviços
• Banco de dados compartilhado
• Desenvolvimento full-stack

✅ Projeto entregue em 3 dias conforme cronograma
```

## 🎯 Dicas para a Apresentação

### **Preparação Antes da Apresentação**
1. **Teste tudo** - Execute `docker compose up --build` antes
2. **Prepare dados** - Cadastre alguns produtos e clientes
3. **Teste a demo** - Faça uma venda completa
4. **Verifique logs** - `docker compose logs` para debug
5. **Backup do banco** - Caso precise restaurar dados

### **Durante a Apresentação**
1. **Comece com o objetivo** - Por que microserviços?
2. **Mostre a arquitetura** - Diagrama visual
3. **Execute a demo** - Mostre funcionando
4. **Explique o código** - Slides com código relevante
5. **Destaque conceitos** - PPD aplicados
6. **Fale dos desafios** - O que foi difícil
7. **Conclua com resultados** - O que foi alcançado

### **Código para Destacar**
- **Docker Compose** - Orquestração
- **API de Vendas** - Transações e validação
- **Frontend SPA** - Requisições paralelas
- **Estrutura SQL** - Banco compartilhado
- **Nginx Config** - Proxy reverso

### **Pontos Fortes para Enfatizar**
- **Arquitetura limpa** - Separação de responsabilidades
- **Conceitos de PPD** - Microserviços, comunicação, transações
- **Docker** - Containerização e orquestração
- **Interface moderna** - UX/UI profissional
- **Código limpo** - Bem documentado e organizado

### **Possíveis Perguntas do Professor**
1. **"Por que SQLite compartilhado?"**
   - Simplicidade para protótipo
   - Transações ACID
   - Integridade referencial

2. **"Como garante consistência?"**
   - Transações atômicas
   - Foreign keys
   - Validação entre serviços

3. **"E se um serviço falhar?"**
   - Health checks
   - Tratamento de erros
   - Logs para debugging

4. **"Como escalaria isso?"**
   - Load balancer
   - Cache Redis
   - Message queues
   - Database sharding

---

**Boa sorte na apresentação! 🚀**
