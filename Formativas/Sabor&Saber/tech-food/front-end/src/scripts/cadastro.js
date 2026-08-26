document.addEventListener("DOMContentLoaded", function () {
  inicializarCadastro();
});

function inicializarCadastro() {
  const form         = document.querySelector("#form-cadastro");
  const btnLimpar    = document.querySelector("#btn-limpar-form");
  const inputImagem  = document.querySelector("#input-imagem");
  const inputDesc    = document.querySelector("#input-descricao");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault(); 
    salvarNovoPrato();
  });

  if (btnLimpar) {
    btnLimpar.addEventListener("click", limparFormulario);
  }

  if (inputImagem) {
    inputImagem.addEventListener("input", configurarPreviewImagem);
  }

  if (inputDesc) {
    inputDesc.addEventListener("input", configurarContadorDescricao);
  }
}

function configurarContadorDescricao() {
  const inputDesc  = document.querySelector("#input-descricao");
  const contador   = document.querySelector("#contador-descricao");
  if (!inputDesc || !contador) return;

  const atual = inputDesc.value.length;
  const maximo = 200;
  contador.textContent = `${atual} / ${maximo}`;
  contador.style.color = atual >= maximo ? "#e74c3c" : "#aaa";
}


function configurarPreviewImagem() {
  const inputImagem  = document.querySelector("#input-imagem");
  const container    = document.querySelector("#preview-imagem-container");
  const imgEl        = document.querySelector("#preview-imagem");
  const erroImagem   = document.querySelector("#erro-imagem");

  if (!inputImagem || !container || !imgEl) return;

  const url = inputImagem.value.trim();

  // Campo vazio — oculta o preview sem exibir erro
  if (!url) {
    container.style.display = "none";
    if (erroImagem) erroImagem.textContent = "";
    return;
  }

  const testImg = new Image();
  testImg.onload = function () {
    imgEl.src = url;
    container.style.display = "block";
    if (erroImagem) erroImagem.textContent = "";
  };
  testImg.onerror = function () {
    container.style.display = "none";
    if (erroImagem) erroImagem.textContent = "URL inválida ou imagem não encontrada.";
  };
  testImg.src = url;
}

function validarFormulario() {
  let valido = true;

  document.querySelectorAll(".campo-erro").forEach(function (span) {
    span.textContent = "";
  });

  const nome      = document.querySelector("#input-nome").value.trim();
  const descricao = document.querySelector("#input-descricao").value.trim();
  const preco     = parseFloat(document.querySelector("#input-preco").value);
  const categoria = document.querySelector("#select-categoria").value;

  if (!nome) {
    document.querySelector("#erro-nome").textContent = "Informe o nome do prato.";
    valido = false;
  }

  if (!descricao) {
    document.querySelector("#erro-descricao").textContent = "Informe a descrição do prato.";
    valido = false;
  }

  if (isNaN(preco) || preco <= 0) {
    document.querySelector("#erro-preco").textContent = "Informe um preço válido (maior que zero).";
    valido = false;
  }

  if (!categoria) {
    document.querySelector("#erro-categoria").textContent = "Selecione uma categoria.";
    valido = false;
  }

  return valido;
}


async function salvarNovoPrato() {
  if (!validarFormulario()) return;

  const btnSalvar = document.querySelector("#btn-salvar-prato");
  const feedback  = document.querySelector("#feedback-cadastro");

  const novoPrato = {
    nome:      document.querySelector("#input-nome").value.trim(),
    descricao: document.querySelector("#input-descricao").value.trim(),
    preco:     parseFloat(document.querySelector("#input-preco").value),
    categoria: document.querySelector("#select-categoria").value,
    imagem:    document.querySelector("#input-imagem").value.trim() || null,
  };

  btnSalvar.disabled    = true;
  btnSalvar.textContent = "Salvando...";

  try {
    const pratoCriado = await cadastrarProduto(novoPrato); 

    exibirFeedback(feedback, "sucesso", `✓ Prato "${novoPrato.nome}" cadastrado com sucesso!`);
    adicionarPratoNaListaRecentes(pratoCriado.dados || novoPrato);
    limparFormulario();

    btnSalvar.textContent = "✓ Salvo!";
    btnSalvar.style.backgroundColor = "#27ae60";

    setTimeout(function () {
      btnSalvar.textContent = "✓ Salvar Prato";
      btnSalvar.style.backgroundColor = "";
      btnSalvar.disabled = false;
    }, 2000);

  } catch (erro) {
    exibirFeedback(feedback, "erro", `Erro ao cadastrar: ${erro.message}`);
    btnSalvar.textContent = "✓ Salvar Prato";
    btnSalvar.disabled = false;
  }
}


function exibirFeedback(elemento, tipo, mensagem) {
  if (!elemento) return;

  elemento.textContent  = mensagem;
  elemento.className    = `feedback-${tipo}`;
  elemento.style.display = "block";

  setTimeout(function () {
    elemento.style.display = "none";
  }, 4000);
}


function adicionarPratoNaListaRecentes(prato) {
  const secaoRecentes = document.querySelector("#secao-recentes");
  const lista         = document.querySelector("#lista-recentes");
  if (!lista || !secaoRecentes) return;

  secaoRecentes.style.display = "block";

  const li = document.createElement("li");
  li.classList.add("item-recente");
  li.innerHTML =
    `<strong>${prato.nome}</strong>` +
    ` <span class="categoria-badge">${prato.categoria}</span>` +
    ` — R$ ${parseFloat(prato.preco).toFixed(2).replace(".", ",")}` +
    `<span class="recente-label">✓ Cadastrado</span>`;

  lista.appendChild(li);
}


function limparFormulario() {
  const form = document.querySelector("#form-cadastro");
  if (form) form.reset();

  document.querySelectorAll(".campo-erro").forEach(function (span) {
    span.textContent = "";
  });

  const contador = document.querySelector("#contador-descricao");
  if (contador) contador.textContent = "0 / 200";

  const container = document.querySelector("#preview-imagem-container");
  if (container) container.style.display = "none";
}