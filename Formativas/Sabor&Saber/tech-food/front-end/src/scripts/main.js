document.addEventListener("DOMContentLoaded", function () {
  renderizarCardapio(); // NEW — busca produtos da API e monta os cards
  inicializarVitrine();
  inicializarHoverCards();
});


async function renderizarCardapio() {
  const grid = document.querySelector("#grid-cardapio");
  if (!grid) return;

  grid.innerHTML = "<p class='loading'>Carregando cardápio...</p>";

  try {
    
    const produtos = await buscarProdutos(); // HTTP GET → http://localhost:3000/produtos

    grid.innerHTML = "";

    produtos.forEach(function (produto) {
      const card = document.createElement("article");
      card.classList.add("card");
      card.setAttribute("data-id", produto.id); // ID do banco

  
      card.innerHTML =
        // `<img src='${imgSrc}' alt='${produto.nome}'>` +  // Aula 10
        `<h3>${produto.nome}</h3>` +
        `<p class='desc'>${produto.descricao}</p>` +
        `<div class='quantidade-box'>` +
          `<button class='btn-qtd btn-menos'>-</button>` +
          `<span class='qtd-valor'>1</span>` +
          `<button class='btn-qtd btn-mais'>+</button>` +

        `</div>` +
        `<span class='preco' data-preco='${produto.preco}'>` +
          `R$ ${parseFloat(produto.preco).toFixed(2).replace(".", ",")}` +
        `</span>` +
        `<button class='btn-pedido'>Pedir Agora</button>`

      grid.appendChild(card)
    });
  } catch (erro) {

    grid.innerHTML = "<p class='loading erro'>Erro ao carregar o cardápio. Verifique se o servidor está rodando.</p>"
  }
}


function inicializarHoverCards() {
  const cards = document.querySelectorAll(".card")

  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      card.style.transform = "translateY(-5px)";
      card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)"
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "translateY(0)"
      card.style.boxShadow = "none"
    })
  })
}


function inicializarVitrine() {
  const main = document.querySelector("main")
  if (!main) return

  main.addEventListener("click", function (event) {
    const clicado = event.target

    // ── Botão MENOS — idêntico à Aula 8 ─────────────────────────────────────
    if (clicado.classList.contains("btn-menos")) {
      const box    = clicado.parentElement
      const spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Math.max(1, Number(spanQtd.textContent) - 1)
      atualizarPrecoCard(box)
      return;
    }

    // ── Botão MAIS — idêntico à Aula 8 ──────────────────────────────────────
    if (clicado.classList.contains("btn-mais")) {
      const box    = clicado.parentElement;
      const spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Number(spanQtd.textContent) + 1;
      atualizarPrecoCard(box);
      return;
    }

    // ── Botão PEDIR AGORA ────────────────────────────────────────────────────
    if (clicado.classList.contains("btn-pedido")) {
      event.preventDefault()


      const card = clicado.parentElement

      // ⚠ Aula 9: lê o data-id do card (produto_id do banco)
      // adicionado por renderizarCardapio() — não existe mais data-nome
      const produtoId = Number(card.getAttribute("data-id"))
      const quantidade = Number(card.querySelector(".qtd-valor").textContent)

      salvarPedido(produtoId, quantidade, clicado)
    }
  })
}


function atualizarPrecoCard(box) {
  const card          = box.parentElement;
  const spanPreco     = card.querySelector(".preco");
  const precoUnitario = parseFloat(spanPreco.getAttribute("data-preco"));
  const quantidade    = Number(box.querySelector(".qtd-valor").textContent);
  const total         = precoUnitario * quantidade;

  spanPreco.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  spanPreco.style.color = total > 150 ? "#c0392b" : "#e67e22";
}


function salvarPedido(produtoId, quantidade, botao) {
  const card    = botao.parentElement;
  const nome    = card.querySelector("h3").textContent;
  const preco   = parseFloat(card.querySelector(".preco").getAttribute("data-preco"));
  const subtotal = preco * quantidade;

  // Padrão Aula 8: ler → modificar → salvar
  const lista = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");
  lista.push({
    produto_id: produtoId,  // ⚠ novo em Aula 9 — usado pelo criarPedido()
    quantidade,             // ⚠ renomeado de qtd para quantidade (formato API)
    nome,
    preco,
    subtotal,
  });
  localStorage.setItem("techfood_pedidos", JSON.stringify(lista));

  // Feedback visual — igual Aula 8
  botao.textContent           = "✓ Adicionado!";
  botao.style.backgroundColor = "#27ae60";

  atualizarContadorPedidos();

  setTimeout(function () {
    botao.textContent           = "Pedir Agora";
    botao.style.backgroundColor = "";
    botao.disabled = false;

    const box = card.querySelector(".quantidade-box");
    if (box) {
      box.querySelector(".qtd-valor").textContent = "1";
      atualizarPrecoCard(box);
    }
  }, 1500);
}


function atualizarContadorPedidos() {
  const lista = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");
  const total = lista.reduce(function (acc, p) { return acc + p.quantidade; }, 0);

  const linkMenu = document.querySelector("#menu a[href='pedidos.html']");
  if (!linkMenu) return;

  let badge = linkMenu.querySelector(".badge-menu");
  if (!badge) {
    linkMenu.insertAdjacentHTML("beforeend", "<span class='badge-menu'>0</span>");
    badge = linkMenu.querySelector(".badge-menu");
  }

  badge.textContent = total;
  linkMenu.classList.add("menu-ativo");
}


// ─────────────────────────────────────────────────────────────────────────────
// inicializarSubtotal()                               DESATIVADA NA AULA 9
// Aula 8: controlava o campo #qtd-lasanha que ficava fixo no index.html.
//   Quando o usuário digitava uma quantidade, recalculava o preço exibido.
//
// Por que não está no DOMContentLoaded da Aula 9?
//   O index.html da Aula 9 não tem mais cards fixos. O grid (#grid-cardapio)
//   começa vazio e é preenchido por renderizarCardapio() via API. Não existe
//   mais #qtd-lasanha no HTML — esta função não teria nada para encontrar.
//   A lógica de recalcular preço por quantidade é feita por atualizarPrecoCard(),
//   chamada pelos botões + e - em inicializarVitrine().
// ─────────────────────────────────────────────────────────────────────────────
// function inicializarSubtotal() {
//   var inputQtd   = document.querySelector("#qtd-lasanha");
//   var precoTexto = document.querySelector("#preco-lasanha");
//   var subTexto   = document.querySelector("#sub-lasanha");
//
//   if (!inputQtd || !precoTexto) return;
//
//   inputQtd.addEventListener("input", function () {
//     var precoUnitario = 45.0;
//     var quantidade    = Number(inputQtd.value);
//
//     if (isNaN(quantidade) || quantidade < 1) return;
//
//     var total = quantidade * precoUnitario;
//     precoTexto.textContent = "R$ " + total.toFixed(2).replace(".", ",");
//     precoTexto.style.color = total > 150 ? "#c0392b" : "#e67e22";
//
//     if (subTexto) {
//       subTexto.textContent =
//         quantidade > 1
//           ? quantidade + "x R$ " + precoUnitario.toFixed(2).replace(".", ",")
//           : "";
//     }
//   });
// }
