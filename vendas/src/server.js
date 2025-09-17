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
  produto_id INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);`);

app.get('/health', (_req, res) => { 
  res.json({ status: 'ok' }); 
});

app.post('/vendas', async (req, res) => {
  const { cliente_id, produto_id, quantidade } = req.body;
  
  if (!cliente_id || !produto_id || !quantidade) {
    return res.status(400).json({ 
      error: 'cliente_id, produto_id e quantidade são obrigatórios' 
    });
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

    const stmt = db.prepare('INSERT INTO vendas (cliente_id, produto_id, quantidade) VALUES (?, ?, ?)');
    const info = stmt.run(Number(cliente_id), Number(produto_id), Number(quantidade));
    const venda = db.prepare('SELECT * FROM vendas WHERE id = ?').get(info.lastInsertRowid);
    
    res.status(201).json(venda);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/vendas', (_req, res) => {
  const rows = db.prepare('SELECT * FROM vendas ORDER BY id DESC').all();
  res.json(rows);
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`vendas service listening on ${PORT}`));
