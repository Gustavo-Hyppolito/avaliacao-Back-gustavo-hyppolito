const ProdutoRepository = require('../repositories/ProdutoRepository');
const fs = require('fs').promises;
const path = require('path');

class ProdutoService {
    async listarProdutos() {
        const produtos = await ProdutoRepository.findAll();
        const produtosFormatados = produtos.map(p => ({
            ...p,
            imagem: p.imagem ? `/public/${p.imagem}` : null
        }));
        return {
            sucesso: true,
            dados: produtosFormatados,
            total: produtosFormatados.length
        };
    }

    async buscarProdutoPorId(id) {
        if (!id || isNaN(id)) {
            throw { status: 400, mensagem: "ID inválido" };
        }

        const produto = await ProdutoRepository.findById(id);
        if (!produto) {
            throw { status: 404, mensagem: "Produto não encontrado" };
        }

        return {
            sucesso: true,
            dados: {
                ...produto,
                imagem: produto.imagem ? `/public/${produto.imagem}` : null
            }
        };
    }

    async cadastrarProduto(dados) {
        let { nome, descricao, preco, categoria, disponivel, file } = dados;
        
        // Convert preco if it comes as a string from FormData
        if (typeof preco === 'string') {
            preco = parseFloat(preco);
        }

        if (!nome || !descricao || preco === undefined || isNaN(preco)) {
            throw { status: 400, mensagem: "Nome, descrição e preço são obrigatórios e devem ser válidos" };
        }

        if (preco <= 0) {
            throw { status: 400, mensagem: "Preço deve ser um número positivo" };
        }

        const novoProduto = {
            nome: nome.trim(),
            descricao: descricao.trim(),
            preco,
            categoria: categoria || null,
            imagem: file ? `uploads/produtos/${file.filename}` : null,
            disponivel: disponivel === 'false' || disponivel === false ? false : true
        };

        const id = await ProdutoRepository.create(novoProduto);

        return {
            sucesso: true,
            mensagem: "Produto cadastrado com sucesso",
            id
        };
    }

    async atualizarProduto(id, dados) {
        if (!id || isNaN(id)) {
            throw { status: 400, mensagem: "ID inválido" };
        }

        const existe = await ProdutoRepository.findById(id);
        if (!existe) {
            throw { status: 404, mensagem: "Produto não encontrado" };
        }

        const atualizado = {};
        let { nome, descricao, preco, categoria, disponivel, file } = dados;

        if (nome !== undefined) atualizado.nome = nome.trim();
        if (descricao !== undefined) atualizado.descricao = descricao.trim();
        if (preco !== undefined) {
            if (typeof preco === 'string') preco = parseFloat(preco);
            if (isNaN(preco) || preco <= 0) {
                throw { status: 400, mensagem: "Preço deve ser um número positivo" };
            }
            atualizado.preco = preco;
        }
        if (categoria !== undefined) atualizado.categoria = categoria;
        if (disponivel !== undefined) atualizado.disponivel = disponivel === 'false' || disponivel === false ? false : true;

        if (file) {
            atualizado.imagem = `uploads/produtos/${file.filename}`;
            if (existe.imagem) {
                const caminhoAntigo = path.join(__dirname, '..', '..', 'public', existe.imagem);
                try {
                    await fs.unlink(caminhoAntigo);
                } catch (err) {
                    console.error("Erro ao apagar imagem antiga:", err);
                }
            }
        }

        if (Object.keys(atualizado).length === 0) {
            throw { status: 400, mensagem: "Nenhum dado válido enviado para atualização" };
        }

        await ProdutoRepository.update(id, atualizado);

        return {
            sucesso: true,
            mensagem: "Produto atualizado com sucesso"
        };
    }

    async deletarProduto(id) {
        if (!id || isNaN(id)) {
            throw { status: 400, mensagem: "ID inválido" };
        }

        const existe = await ProdutoRepository.findById(id);
        if (!existe) {
            throw { status: 404, mensagem: "Produto não encontrado" };
        }

        if (existe.imagem) {
            const caminho = path.join(__dirname, '..', '..', 'public', existe.imagem);
            try {
                await fs.unlink(caminho);
            } catch (err) {
                console.error("Erro ao apagar imagem no deletar:", err);
            }
        }

        await ProdutoRepository.delete(id);

        return {
            sucesso: true,
            mensagem: "Produto apagado com sucesso"
        };
    }
}

module.exports = new ProdutoService();
