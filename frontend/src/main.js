const tabButtons = document.querySelectorAll('nav.tabs button');
const tabs = document.querySelectorAll('.tab');

for (const btn of tabButtons) {
  btn.addEventListener('click', () => {
    document.querySelector('nav.tabs .active')?.classList.remove('active');
    btn.classList.add('active');
    const id = btn.getAttribute('data-tab');
    for (const sec of tabs) sec.classList.toggle('active', sec.id === id);
  });
}

const api = {
  produtos: {
    list: () => fetch('/api/produtos').then(r => r.json()),
    create: (data) => fetch('/api/produtos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  },
  clientes: {
    list: () => fetch('/api/clientes').then(r => r.json()),
    create: (data) => fetch('/api/clientes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  },
  vendas: {
    list: () => fetch('/api/vendas').then(r => r.json()),
    create: (data) => fetch('/api/vendas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  },
};

// Produtos
const formProduto = document.getElementById('form-produto');
const listaProdutos = document.getElementById('lista-produtos');

formProduto.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(formProduto);
  const data = Object.fromEntries(fd.entries());
  data.valor = Number(data.valor);
  await api.produtos.create(data);
  formProduto.reset();
  renderProdutos();
});

async function renderProdutos() {
  const items = await api.produtos.list();
  listaProdutos.innerHTML = items.map(p => <li># -  - R$ </li>).join('');
}

// Clientes
const formCliente = document.getElementById('form-cliente');
const listaClientes = document.getElementById('lista-clientes');

formCliente.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(formCliente);
  const data = Object.fromEntries(fd.entries());
  await api.clientes.create(data);
  formCliente.reset();
  renderClientes();
});

async function renderClientes() {
  const items = await api.clientes.list();
  listaClientes.innerHTML = items.map(c => <li># -  - </li>).join('');
}

// Vendas
const formVenda = document.getElementById('form-venda');
const listaVendas = document.getElementById('lista-vendas');

formVenda.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(formVenda);
  const data = Object.fromEntries(fd.entries());
  data.cliente_id = Number(data.cliente_id);
  data.produto_id = Number(data.produto_id);
  data.quantidade = Number(data.quantidade);
  await api.vendas.create(data);
  formVenda.reset();
  renderVendas();
});

async function renderVendas() {
  const items = await api.vendas.list();
  listaVendas.innerHTML = items.map(v => <li># - cliente  - produto  - qtd </li>).join('');
}

// inicial
renderProdutos();
renderClientes();
renderVendas();
