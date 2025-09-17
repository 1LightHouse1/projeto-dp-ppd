// API Helper
const api = {
  produtos: {
    list: async () => {
      const r = await fetch('/api/produtos');
      if (!r.ok) throw new Error('Falha ao listar produtos');
      return r.json();
    },
    create: async (data) => {
      const r = await fetch('/api/produtos', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
      });
      if (!r.ok) throw new Error('Falha ao criar produto');
      return r.json();
    },
  },
  clientes: {
    list: async () => {
      const r = await fetch('/api/clientes');
      if (!r.ok) throw new Error('Falha ao listar clientes');
      return r.json();
    },
    create: async (data) => {
      const r = await fetch('/api/clientes', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
      });
      if (!r.ok) throw new Error('Falha ao criar cliente');
      return r.json();
    },
  },
  vendas: {
    list: async () => {
      const r = await fetch('/api/vendas');
      if (!r.ok) throw new Error('Falha ao listar vendas');
      return r.json();
    },
    create: async (data) => {
      const r = await fetch('/api/vendas', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
      });
      if (!r.ok) throw new Error('Falha ao registrar venda');
      return r.json();
    },
  },
};

// Toast Helper
function showToast(message, type = 'success') {
  const toastContainer = document.querySelector('.toast-container');
  const toastId = 'toast-' + Date.now();
  
  const toastHTML = `
    <div class="toast" id="${toastId}" role="alert">
      <div class="toast-header">
        <i class="bi bi-${type === 'success' ? 'check-circle-fill text-success' : 'exclamation-triangle-fill text-danger'} me-2"></i>
        <strong class="me-auto">${type === 'success' ? 'Sucesso' : 'Erro'}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">${message}</div>
    </div>
  `;
  
  toastContainer.insertAdjacentHTML('beforeend', toastHTML);
  const toast = new bootstrap.Toast(document.getElementById(toastId));
  toast.show();
  
  // Remove after hide
  document.getElementById(toastId).addEventListener('hidden.bs.toast', () => {
    document.getElementById(toastId).remove();
  });
}

// Navigation
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show selected page
  document.getElementById(pageId).classList.add('active');
  
  // Update navbar active state
  document.querySelectorAll('.navbar .nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  // Set active nav link
  const activeLink = document.querySelector(`[onclick="showPage('${pageId}')"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
  
  // Load data for the page
  if (pageId === 'produtos') {
    loadProdutos();
  } else if (pageId === 'clientes') {
    loadClientes();
  } else if (pageId === 'vendas') {
    loadVendas();
  } else if (pageId === 'home') {
    loadStats();
  }
}

// Loading state
function setLoading(element, loading = true) {
  if (loading) {
    element.classList.add('loading');
  } else {
    element.classList.remove('loading');
  }
}

// Stats
async function loadStats() {
  try {
    const [produtos, clientes, vendas] = await Promise.all([
      api.produtos.list(),
      api.clientes.list(),
      api.vendas.list()
    ]);
    
    document.getElementById('total-produtos').textContent = produtos.length;
    document.getElementById('total-clientes').textContent = clientes.length;
    document.getElementById('total-vendas').textContent = vendas.length;
  } catch (err) {
    console.error('Erro ao carregar estatísticas:', err);
  }
}

// Produtos
async function loadProdutos() {
  const tbody = document.getElementById('tbody-produtos');
  setLoading(tbody, true);
  
  try {
    const items = await api.produtos.list();
    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Nenhum produto cadastrado</td></tr>';
    } else {
      tbody.innerHTML = items.map(p => `
        <tr>
          <td><span class="badge bg-primary">${p.id}</span></td>
          <td><strong>${p.nome}</strong></td>
          <td>${p.descricao || '<span class="text-muted">-</span>'}</td>
          <td class="text-end"><strong>R$ ${Number(p.valor).toFixed(2)}</strong></td>
        </tr>
      `).join('');
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Erro ao carregar produtos</td></tr>';
  } finally {
    setLoading(tbody, false);
  }
}

async function salvarProduto() {
  const form = document.getElementById('form-produto');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.valor = Number(data.valor);
  
  try {
  await api.produtos.create(data);
    form.reset();
    bootstrap.Modal.getInstance(document.getElementById('modalProduto')).hide();
    showToast('Produto cadastrado com sucesso!');
    loadProdutos();
    loadStats(); // Atualizar estatísticas
  } catch (err) {
    showToast(err.message || 'Erro ao cadastrar produto', 'error');
  }
}

// Clientes
async function loadClientes() {
  const tbody = document.getElementById('tbody-clientes');
  setLoading(tbody, true);
  
  try {
    const items = await api.clientes.list();
    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Nenhum cliente cadastrado</td></tr>';
    } else {
      tbody.innerHTML = items.map(c => `
        <tr>
          <td><span class="badge bg-success">${c.id}</span></td>
          <td><strong>${c.nome}</strong></td>
          <td>${c.telefone || '<span class="text-muted">-</span>'}</td>
        </tr>
      `).join('');
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Erro ao carregar clientes</td></tr>';
  } finally {
    setLoading(tbody, false);
  }
}

async function salvarCliente() {
  const form = document.getElementById('form-cliente');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  try {
  await api.clientes.create(data);
    form.reset();
    bootstrap.Modal.getInstance(document.getElementById('modalCliente')).hide();
    showToast('Cliente cadastrado com sucesso!');
    loadClientes();
    loadStats(); // Atualizar estatísticas
  } catch (err) {
    showToast(err.message || 'Erro ao cadastrar cliente', 'error');
  }
}

// Vendas
async function loadVendas() {
  const tbody = document.getElementById('tbody-vendas');
  setLoading(tbody, true);
  
  try {
    const [vendas, clientes, produtos] = await Promise.all([
      api.vendas.list(),
      api.clientes.list(),
      api.produtos.list()
    ]);
    
    if (vendas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhuma venda registrada</td></tr>';
    } else {
      // Criar mapas para busca rápida
      const clientesMap = new Map(clientes.map(c => [c.id, c.nome]));
      const produtosMap = new Map(produtos.map(p => [p.id, p.nome]));
      
      tbody.innerHTML = vendas.map(v => {
        // Processar itens da venda
        const itensHtml = v.itens && v.itens.length > 0 
          ? v.itens.map(item => {
              const produtoNome = produtosMap.get(item.produto_id) || 'Produto não encontrado';
              return `<span class="badge bg-primary me-1 mb-1">${produtoNome} (${item.quantidade})</span>`;
            }).join('')
          : '<span class="text-muted">Sem produtos</span>';
        
        const totalItens = v.itens ? v.itens.reduce((sum, item) => sum + item.quantidade, 0) : 0;
        
        return `
          <tr>
            <td><span class="badge bg-warning">${v.id}</span></td>
            <td><span class="badge bg-success">${clientesMap.get(v.cliente_id) || 'Cliente não encontrado'}</span></td>
            <td>${itensHtml}</td>
            <td><strong>${totalItens}</strong></td>
            <td>${v.criado_em || '-'}</td>
          </tr>
        `;
      }).join('');
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Erro ao carregar vendas</td></tr>';
  } finally {
    setLoading(tbody, false);
  }
}

// Load dropdowns for venda modal
async function loadDropdowns() {
  try {
    [clientesList, produtosList] = await Promise.all([
      api.clientes.list(),
      api.produtos.list()
    ]);
    
    // Populate clientes dropdown
    const clienteSelect = document.getElementById('select-cliente');
    clienteSelect.innerHTML = '<option value="">Selecione um cliente...</option>' +
      clientesList.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
    
    // Populate produtos dropdowns
    populateProdutosDropdowns();
  } catch (err) {
    showToast('Erro ao carregar dados para venda', 'error');
  }
}

// Populate all produto dropdowns
function populateProdutosDropdowns() {
  const produtoSelects = document.querySelectorAll('.produto-select');
  produtoSelects.forEach(select => {
    select.innerHTML = '<option value="">Selecione um produto...</option>' +
      produtosList.map(p => `<option value="${p.id}">${p.nome} - R$ ${Number(p.valor).toFixed(2)}</option>`).join('');
  });
}

// Add new produto to venda
function adicionarProduto() {
  const container = document.getElementById('produtos-container');
  const produtoItem = document.createElement('div');
  produtoItem.className = 'produto-item mb-3 p-3 border rounded';
  produtoItem.innerHTML = `
    <div class="row g-2">
      <div class="col-md-6">
        <label class="form-label small">Produto</label>
        <select class="form-select produto-select" name="produto_id[]" required>
          <option value="">Selecione um produto...</option>
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label small">Quantidade</label>
        <input type="number" class="form-control quantidade-input" name="quantidade[]" min="1" value="1" required>
      </div>
      <div class="col-md-2 d-flex align-items-end">
        <button type="button" class="btn btn-outline-danger btn-sm" onclick="removerProduto(this)">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  `;
  
  container.appendChild(produtoItem);
  populateProdutosDropdowns();
  updateRemoveButtons();
}

// Remove produto from venda
function removerProduto(button) {
  button.closest('.produto-item').remove();
  updateRemoveButtons();
}

// Update remove buttons visibility
function updateRemoveButtons() {
  const produtoItems = document.querySelectorAll('.produto-item');
  const removeButtons = document.querySelectorAll('.produto-item .btn-outline-danger');
  
  removeButtons.forEach((btn, index) => {
    btn.style.display = produtoItems.length > 1 ? 'block' : 'none';
  });
}

async function salvarVenda() {
  const form = document.getElementById('form-venda');
  const formData = new FormData(form);
  
  const clienteId = formData.get('cliente_id');
  const produtoIds = formData.getAll('produto_id[]');
  const quantidades = formData.getAll('quantidade[]');
  
  // Validation
  if (!clienteId) {
    showToast('Selecione um cliente', 'error');
    return;
  }
  
  if (produtoIds.some(id => !id)) {
    showToast('Selecione um produto para todos os itens', 'error');
    return;
  }
  
  if (quantidades.some(q => !q || q < 1)) {
    showToast('Quantidade deve ser maior que zero', 'error');
    return;
  }
  
  try {
    // Create single venda with multiple produtos
    const produtos = produtoIds.map((produtoId, index) => ({
      produto_id: Number(produtoId),
      quantidade: Number(quantidades[index])
    }));
    
    await api.vendas.create({
      cliente_id: Number(clienteId),
      produtos: produtos
    });
    
    form.reset();
    // Reset to single produto item
    const container = document.getElementById('produtos-container');
    container.innerHTML = `
      <div class="produto-item mb-3 p-3 border rounded">
        <div class="row g-2">
          <div class="col-md-6">
            <label class="form-label small">Produto</label>
            <select class="form-select produto-select" name="produto_id[]" required>
              <option value="">Selecione um produto...</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label small">Quantidade</label>
            <input type="number" class="form-control quantidade-input" name="quantidade[]" min="1" value="1" required>
          </div>
          <div class="col-md-2 d-flex align-items-end">
            <button type="button" class="btn btn-outline-danger btn-sm" onclick="removerProduto(this)" style="display: none;">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    
    bootstrap.Modal.getInstance(document.getElementById('modalVenda')).hide();
    showToast('Venda registrada com sucesso!');
    loadVendas();
    loadStats(); // Atualizar estatísticas
  } catch (err) {
    showToast(err.message || 'Erro ao registrar venda', 'error');
  }
}

// Global variables for dropdowns
let clientesList = [];
let produtosList = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // Load initial data
  loadStats();
  loadProdutos();
  loadClientes();
  loadVendas();
  
  // Set home as active by default
  showPage('home');
  
  // Load dropdowns when modal opens
  document.getElementById('modalVenda').addEventListener('show.bs.modal', function() {
    loadDropdowns();
  });
});