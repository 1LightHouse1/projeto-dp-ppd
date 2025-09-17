import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database('/data/app.db');
db.exec(`CREATE TABLE IF NOT EXISTS vendas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id INTEGER NOT NULL,
  criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);`);

db.exec(`CREATE TABLE IF NOT EXISTS venda_itens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  venda_id INTEGER NOT NULL,
  produto_id INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  FOREIGN KEY (venda_id) REFERENCES vendas (id) ON DELETE CASCADE
);`);

app.get('/health', (_req, res) => { 
  res.json({ status: 'ok' }); 
});

app.post('/vendas', async (req, res) => {
  const { cliente_id, produtos } = req.body;
  
  if (!cliente_id || !produtos || !Array.isArray(produtos) || produtos.length === 0) {
    return res.status(400).json({ 
      error: 'cliente_id e produtos (array) são obrigatórios' 
    });
  }

  // Validar estrutura dos produtos
  for (const produto of produtos) {
    if (!produto.produto_id || !produto.quantidade) {
      return res.status(400).json({ 
        error: 'Cada produto deve ter produto_id e quantidade' 
      });
    }
  }

  try {
    // Validação opcional dos IDs (pode ser desligada via env)
    if (process.env.VALIDA_IDS !== 'false') {
      const [cliRes, prodRes] = await Promise.all([
        fetch(process.env.CLIENTES_URL || 'http://clientes:5002/clientes'),
        fetch(process.env.PRODUTOS_URL || 'http://produtos:5001/produtos')
      ]);
      
      if (!cliRes.ok || !prodRes.ok) {
        throw new Error('Serviços dependentes indisponíveis');
      }
    }

    // Iniciar transação
    const insertVenda = db.prepare('INSERT INTO vendas (cliente_id) VALUES (?)');
    const insertItem = db.prepare('INSERT INTO venda_itens (venda_id, produto_id, quantidade) VALUES (?, ?, ?)');
    
    const transaction = db.transaction(() => {
      // Criar venda
      const vendaInfo = insertVenda.run(Number(cliente_id));
      const vendaId = vendaInfo.lastInsertRowid;
      
      // Adicionar itens
      for (const produto of produtos) {
        insertItem.run(vendaId, Number(produto.produto_id), Number(produto.quantidade));
      }
      
      return vendaId;
    });
    
    const vendaId = transaction();
    
    // Buscar venda completa com itens
    const venda = db.prepare(`
      SELECT v.*, 
             GROUP_CONCAT(vi.produto_id || ':' || vi.quantidade) as itens
      FROM vendas v
      LEFT JOIN venda_itens vi ON v.id = vi.venda_id
      WHERE v.id = ?
      GROUP BY v.id
    `).get(vendaId);
    
    res.status(201).json(venda);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/vendas', (_req, res) => {
  const rows = db.prepare(`
    SELECT v.*, 
           GROUP_CONCAT(vi.produto_id || ':' || vi.quantidade) as itens
    FROM vendas v
    LEFT JOIN venda_itens vi ON v.id = vi.venda_id
    GROUP BY v.id
    ORDER BY v.id DESC
  `).all();
  
  // Processar itens para formato mais amigável
  const vendas = rows.map(venda => ({
    ...venda,
    itens: venda.itens ? venda.itens.split(',').map(item => {
      const [produto_id, quantidade] = item.split(':');
      return { produto_id: Number(produto_id), quantidade: Number(quantidade) };
    }) : []
  }));
  
  res.json(vendas);
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`vendas service listening on ${PORT}`));
