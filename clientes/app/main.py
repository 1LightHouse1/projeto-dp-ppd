from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3

app = FastAPI()

DB_PATH = '/data/app.db'

class ClienteIn(BaseModel):
    nome: str
    telefone: str | None = None

class Cliente(BaseModel):
    id: int
    nome: str
    telefone: str | None = None

# init db
conn = sqlite3.connect(DB_PATH)
conn.execute("CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, telefone TEXT)")
conn.commit()
conn.close()

@app.get('/health')
def health():
    return { 'status': 'ok' }

@app.post('/clientes', response_model=Cliente, status_code=201)
def criar_cliente(payload: ClienteIn):
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        cur.execute("INSERT INTO clientes (nome, telefone) VALUES (?, ?)", (payload.nome, payload.telefone))
        conn.commit()
        cid = cur.lastrowid
        row = conn.execute("SELECT id, nome, telefone FROM clientes WHERE id = ?", (cid,)).fetchone()
    return Cliente(id=row[0], nome=row[1], telefone=row[2])

@app.get('/clientes')
def listar_clientes():
    with sqlite3.connect(DB_PATH) as conn:
        rows = conn.execute("SELECT id, nome, telefone FROM clientes ORDER BY id DESC").fetchall()
    return [ Cliente(id=r[0], nome=r[1], telefone=r[2]).dict() for r in rows ]
