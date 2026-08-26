const statusCargas = {
 "BR12345": "Em trânsito para o centro de distribuição",
 "BR67890": "Entregue ao destinatário",
 "BR54321": "Aguardando retirada na agência"
 };

function rastrearCarga(codigoRastreio, callback) {
  return callback(codigoRastreio);
}
function buscarstatus(codigo) {
  if (statusCargas[codigo]) {
 return statusCargas[codigo];
  } else {
    return "Código não encontrado.";
  }
}
  
console.log(rastrearCarga("BR12345", buscarstatus));
console.log(rastrearCarga("BR00000", buscarstatus));


/////////////


class ItemEstoque { 

     constructor(codigo, descrição, localização) { 

        this.codigo = codigo

        this.descrição = descrição

        this. localização = localização

    } 

   obertLocalização() { 

        return `O item está em: ${this.localização} `

    } 
    atualizarLocalizacao(novaLocalizacao){
      return `O item agora está: ${this.localização = novaLocalizacao}`
    }

 } 
 

const produto1 = new ItemEstoque("0612", "É bonito", "Corredor G, Prateleira 3") 


 console.log(`O codigo do produto é: ${produto1.codigo}; a sua descrição: ${produto1.descrição}; e sua localização é ${produto1.obertLocalização()}`) 
console.log(produto1.atualizarLocalizacao("Corredor J, Prateleira 6"))
 
///////////

 class Rota { 
    constructor( codigo, veiculo, endereços) { 
        this.codigo = codigo

        this.veiculo = veiculo

        this. endereços = endereços

    } 

    NovoDestino(DestinoAtual){
      return `Trocamos para ${this.endereços = DestinoAtual}`
    }
    exibirresumo() { 

        return `Rota é: ${this.codigo}, o veículo utilizado é: ${this.veiculo}, e o destino final é: ${this.endereços}`

 } 
}
 const rota1 = new Rota("1206", "Eclipsi", "Rua Santo Daniel");

console.log(rota1.NovoDestino("Rua Gabriel Assunção Dutra"));
console.log(rota1.exibirresumo());
rota1.NovoDestino("Rua Gabriel Assunção Dutra");
console.log(rota1.exibirresumo());

/////////


 class Embalagem { 

    constructor(id, pesoMaximo) { 

        this.id = id

        this.pesoMaximo = pesoMaximo

    } 

} 

class Caixa extends Embalagem { 

    constructor(id, L, h, profundidade ) { 

        super(id,25) 

        this.L = L
        this.h = h
        this.profundidade = profundidade

    } 
    podeConter(pesoItem){
      return pesoItem <= this.pesoMaximo;
    }


} 

class Palete extends Embalagem { 

    constructor(id, material ) { 

         super(id, 1000) 

        this.material = material;

    } 
    podeConter(pesoItem){
      return pesoItem <= this.pesoMaximo;
    }

} 

const caixa1 = new Caixa("C001", 10, 10, 10);
const palete1 = new Palete("P001", "Madeira");

console.log(`A caixa pode conter o item? ${caixa1.podeConter(20)}`); 
console.log(`O palete pode conter o item? ${palete1.podeConter(200)}`);
 

////////////////////////


class Tarefa {
  constructor(descricao, responsavel) {
    this.descricao = descricao;
    this.responsavel = responsavel;
  }

  calcularTempoEstimado() {
   
    return 0;
  }
}

class SepararPedido extends Tarefa {
  constructor(descricao, responsavel, quantidadeItens) {
    super(descricao, responsavel);
    this.quantidadeItens = quantidadeItens;
  }

  calcularTempoEstimado() {
    return this.quantidadeItens * 5;
  }
}

class ConferirCarga extends Tarefa {
  constructor(descricao, responsavel) {
    super(descricao, responsavel);
  }

  calcularTempoEstimado() {
    return 60;
  }
}

const tarefas = [
  new SepararPedido("Separar", "João", 10),
  new ConferirCarga("Conferir carga do caminhão", "Maria"),
  new SepararPedido("Separar", "Ana", 5),
];

for(let i = 0; i < tarefas.length; i++) {
  let t = tarefas[i];
  console.log(`${t.descricao}, Tempo Estimado: ${t.calcularTempoEstimado()} minutos`);
}

///////////////


class Almoxarifado {

  #quantidade;
  nome;
  constructor(nome, quantidade) {
    this.nome = nome;
    this.#quantidade = quantidade;
  }
  adicionarEstoque(qtd){
    if(qtd > 0){
      this.#quantidade += qtd;
    } else {
      return "Quantidade inválida";
    }
   }
  retiraPedido(qtd){
    if(qtd <= this.#quantidade){
      this.#quantidade -= qtd;
    }
  }
  consultarEstoque(){
    return `Você tem ${this.#quantidade} unidades de ${this.nome} em estoque.`
  }
}

let produto2 = new Almoxarifado("Parafusos", 100);
console.log(produto1.consultarEstoque());
produto1.adicionarEstoque(50);
console.log(produto1.consultarEstoque());
produto1.retiraPedido(30);
console.log(produto1.consultarEstoque());


/////////////////////

