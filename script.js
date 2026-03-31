const form = document.getElementById('formDespesa');
const listaDespesas = document.getElementById('listaDespesas');

let despesas = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const valor = parseFloat(document.getElementById('valor').value);
  const categoria = document.getElementById('categoria').value;
  const nota = document.getElementById('nota').value;

  const despesa = { nome, valor, categoria, nota };
  despesas.push(despesa);

  form.reset();
  atualizarLista();
});

function atualizarLista() {
  listaDespesas.innerHTML = '';

  despesas.forEach((d, index) => {
    const div = document.createElement('div');
    div.classList.add('despesa-card');

    div.innerHTML = `
      <strong>${d.nome}</strong>
      <span>R$ ${d.valor.toFixed(2)}</span>
      <span>Categoria: ${d.categoria}</span>
      ${d.nota ? `<small>Nota: ${d.nota}</small>` : ''}
    `;

    const btnDeletar = document.createElement('button');
    btnDeletar.textContent = 'X';
    btnDeletar.addEventListener('click', () => {
      despesas.splice(index, 1);
      atualizarLista();
    });

    div.appendChild(btnDeletar);
    listaDespesas.appendChild(div);
  });
}

atualizarLista();