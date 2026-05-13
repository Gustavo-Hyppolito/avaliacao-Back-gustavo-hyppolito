const ProdutoRepository = require('../repositories/ProdutoRepository');

class ProdutoService {
    async listarProdutos() {
        const produtos = await ProdutoRepository.findAll();
        return { sucesso: true, dados: produtos, total: produtos.length };
    }

    async buscarProdutoPorId(id) {
        if (!id || isNaN(id)) throw { status: 400, mensagem: "ID inválido" };
        const produto = await ProdutoRepository.findById(id);
        if (!produto) throw { status: 404, mensagem: "Produto não encontrado" };
        return { sucesso: true, dados: produto };
    }

    async cadastrarProduto(dados) {
        const { nome, descricao, preco, estoque, categoria, disponivel } = dados;
        if (!nome || !descricao || preco === undefined || estoque === undefined) {
            throw { status: 400, mensagem: "Nome, descrição, preço e estoque são obrigatórios" };
        }
        if (typeof preco !== "number" || preco < 0) {
            throw { status: 400, mensagem: "Preço deve ser um número positivo" };
        }
        if (typeof estoque !== "number" || estoque < 0) {
            throw { status: 400, mensagem: "Estoque não pode ser negativo" };
        }

        const novoProduto = {
            nome: nome.trim(),
            descricao: descricao.trim(),
            preco,
            estoque,
            categoria: categoria || null,
            disponivel: disponivel ?? true
        };

        const id = await ProdutoRepository.create(novoProduto);
        return { sucesso: true, mensagem: "Produto cadastrado com sucesso", id };
    }

    async atualizarProduto(id, dados) {
        if (!id || isNaN(id)) throw { status: 400, mensagem: "ID inválido" };
        
        const existe = await ProdutoRepository.findById(id);
        if (!existe) throw { status: 404, mensagem: "Produto não encontrado" };

        const atualizado = {};
        const { nome, descricao, preco, estoque, categoria, disponivel } = dados;

        if (nome !== undefined) atualizado.nome = nome.trim();
        if (descricao !== undefined) atualizado.descricao = descricao.trim();
        if (preco !== undefined) {
            if (typeof preco !== "number" || preco < 0) throw { status: 400, mensagem: "Preço inválido" };
            atualizado.preco = preco;
        }
        if (estoque !== undefined) {
            if (typeof estoque !== "number" || estoque < 0) throw { status: 400, mensagem: "Estoque inválido" };
            atualizado.estoque = estoque;
        }
        if (categoria !== undefined) atualizado.categoria = categoria;
        if (disponivel !== undefined) atualizado.disponivel = disponivel;

        if (Object.keys(atualizado).length === 0) throw { status: 400, mensagem: "Nenhum dado válido" };

        await ProdutoRepository.update(id, atualizado);
        return { sucesso: true, mensagem: "Produto atualizado com sucesso" };
    }
    async deletarProduto(id) {
        if (!id || isNaN(id)) throw { status: 400, mensagem: "ID inválido" };
        const existe = await ProdutoRepository.findById(id);
        if (!existe) throw { status: 404, mensagem: "Produto não encontrado" };

        await ProdutoRepository.delete(id);
        return { sucesso: true, mensagem: "Produto apagado com sucesso" };
    }
}

module.exports = new ProdutoService();
