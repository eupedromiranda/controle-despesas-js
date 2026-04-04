const form = document.getElementById('formDespesa');
const listaDespesas = document.getElementById('listaDespesas');
const totalEl = document.getElementById('total');
const filtroCategoria = document.getElementById('filtroCategoria');
const toggleDark = document.getElementById('toggleDark');
const graficoEl = document.getElementById('grafico');

let despesas = [];
let grafico;

function atualizarLista() {
  const filtro = filtroCategoria.value;
  const despesasFiltradas = filtro === 'todas' ? despesas : despesas.filter(d => d.categoria === filtro);

  listaDespesas.innerHTML = '';

  despesasFiltradas.forEach((d) => {
    const div = document.createElement('div');
    div.classList.add('despesa-card', d.categoria);
    div.innerHTML = `
      <strong>${d.nome}</strong>
      <span>R$ ${d.valor.toFixed(2)}</span>
      <span>${d.categoria}</span>
      ${d.nota ? `<small>${d.nota}</small>` : ''}
    `;

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'X';
    btnExcluir.addEventListener('click', () => {
      deletarDespesa(d.id);
    });

    const btnEditar = document.createElement('button');
    btnEditar.textContent = '✏️';
    btnEditar.style.right = '35px';
    btnEditar.addEventListener('click', () => {
      document.getElementById('nome').value = d.nome;
      document.getElementById('valor').value = d.valor;
      document.getElementById('categoria').value = d.categoria;
      document.getElementById('nota').value = d.nota;
      deletarDespesa(d.id);
    });

    div.appendChild(btnEditar);
    div.appendChild(btnExcluir);
    listaDespesas.appendChild(div);
  });

  atualizarTotal();
  atualizarGrafico();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const valor = parseFloat(document.getElementById('valor').value);
  const categoria = document.getElementById('categoria').value;
  const nota = document.getElementById('nota').value;

  const despesa = { id: Date.now(), nome, valor, categoria, nota };
  despesas.push(despesa);

  form.reset();
  atualizarLista();
});

function deletarDespesa(id) {
  despesas = despesas.filter(d => d.id !== id);
  atualizarLista();
}

function atualizarTotal() {
  const total = despesas.reduce((acc, d) => acc + d.valor, 0);
  totalEl.textContent = total.toFixed(2);
}

filtroCategoria.addEventListener('change', atualizarLista);

toggleDark.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

function atualizarGrafico() {
  const categorias = ['fixa', 'alimentacao', 'roupas', 'lazer'];
  const valores = categorias.map(c => despesas.filter(d => d.categoria === c).reduce((acc, d) => acc + d.valor, 0));

  if (grafico) {
    grafico.data.datasets[0].data = valores;
    grafico.update();
    return;
  }

  grafico = new Chart(graficoEl, {
    type: 'bar',
    data: {
      labels: ['Fixa', 'Alimentação', 'Roupas', 'Lazer'],
      datasets: [{
        label: 'Despesas por categoria',
        data: valores,
        backgroundColor: ['#2196F3','#4CAF50','#9C27B0','#FF9800']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

atualizarLista();
