import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database('/data/app.db');
db.exec(`CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT,
  valor REAL NOT NULL
);`);

app.get('/health', (_req, res) => { res.json({ status: 'ok' }); });

app.post('/produtos', (req, res) => {
  const { nome, descricao, valor } = req.body;
  if (!nome || valor == null) return res.status(400).json({ error: 'nome e valor são obrigatórios' });
  const stmt = db.prepare('INSERT INTO produtos (nome, descricao, valor) VALUES (?, ?, ?)');
  const info = stmt.run(nome, descricao ?? null, Number(valor));
  const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(produto);
});

app.get('/produtos', (_req, res) => {
  const rows = db.prepare('SELECT * FROM produtos ORDER BY id DESC').all();
  res.json(rows);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`produtos service listening on ${PORT}`));
