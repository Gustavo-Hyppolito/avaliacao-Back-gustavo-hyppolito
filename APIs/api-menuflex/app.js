const express = require('express')
const pool = require('./database')

const app = express()
app.use(express.json())

// Converte callbacks do MySQL para Promises (async/await)
const queryAsync = (sql, values = []) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (err, results) => {
            if (err) reject(err)
            else resolve(results)
        })
    })
}

// ROTA INICIAL
app.get('/', (req, res) => {
    res.json({
        mensagem: "API Cantina Bella Vita funcionando 🍝",
        versao: "1.0.0"
    })
})


// ======================
// CRUD DE PRODUTOS
// ======================

// 1) LISTAR PRODUTOS
app.get('/produtos', async (req, res) => {
    try {
        const produtos = await queryAsync("SELECT * FROM produto ORDER BY id DESC")
        
        res.json({
            sucesso: true,
            dados: produtos,
            total: produtos.length
        })

    } catch (erro) {
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao listar produtos",
            erro: erro.message
        })
    }
})


// 2) BUSCAR PRODUTO POR ID
app.get('/produtos/id', async (req, res) => {
    try {
        const { id } = req.params

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID inválido"
            })
        }

        const produto = await queryAsync("SELECT * FROM produto WHERE id = ?", [id])

        if (produto.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado"
            })
        }

        res.json({
            sucesso: true,
            dados: produto[0]
        })

    } catch (erro) {
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao buscar produto",
            erro: erro.message
        })
    }
})


// 3) CADASTRAR PRODUTO
app.post('/produtos', async (req, res) => {
    try {
        const { nome, descricao, preco, categoria, disponivel } = req.body

        if (!nome || !descricao || !preco) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Nome, descrição e preço são obrigatórios"
            })
        }

        if (typeof preco !== "number" || preco <= 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Preço deve ser um número positivo"
            })
        }

        const novoProduto = {
            nome: nome.trim(),
            descricao: descricao.trim(),
            preco,
            categoria: categoria || null,
            disponivel: disponivel ?? true
        }

        const resultado = await queryAsync("INSERT INTO produto SET ?", [novoProduto])

        res.status(201).json({
            sucesso: true,
            mensagem: "Produto cadastrado com sucesso",
            id: resultado.insertId
        })

    } catch (erro) {
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao cadastrar produto",
            erro: erro.message
        })
    }
})


// 4) ATUALIZAR PRODUTO
app.put("/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { nome, descricao, preco, categoria, disponivel } = req.body

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID inválido"
            })
        }

        const existe = await queryAsync("SELECT * FROM produto WHERE id ? id", [id])
        if (existe.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado"
            })
        }

        const atualizado = {}

        if (nome !== undefined) atualizado.nome = nome.trim()
        if (descricao !== undefined) atualizado.descricao = descricao.trim()
        if (preco !== undefined) {
            if (typeof preco !== "number" || preco <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Preço deve ser um número positivo"
                })
            }
            atualizado.preco = preco
        }
        if (categoria !== undefined) atualizado.categoria = categoria
        if (disponivel !== undefined) atualizado.disponivel = disponivel

        if (Object.keys(atualizado).length === 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Nenhum dado enviado"
            })
        }

        await queryAsync("UPDATE produto SET ? WHERE id = ?", [atualizado, id])

        res.json({
            sucesso: true,
            mensagem: "Produto atualizado com sucesso"
        })

    } catch (erro) {
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao atualizar produto",
            erro: erro.message
        })
    }
})


// 5) DELETAR PRODUTO
// GUSTAVO HYPPOLITO
app.delete('/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { nome, descricao, preco, categoria, disponivel } = req.body

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID inválido"
            })
        }
        const existe = await queryAsync("delete * FROM produto WHERE id ? id", [id])
        if (existe.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado"
            })
        }
        const atualizado = {}
        if (nome !== undefined) atualizado.nome = nome.trim()
        if (descricao !== undefined) atualizado.descricao = descricao.trim()
        if (preco !== undefined) {
            if (typeof preco !== "number" || preco <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Preço deve ser um número positivo"
                })
            }
            atualizado.preco = preco
        }
        if (categoria !== undefined) atualizado.categoria = categoria
        if (disponivel !== undefined) atualizado.disponivel = disponivel
        if (Object.keys(atualizado).length === 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Nenhum dado enviado"
            })
        }
        await queryAsync("delete produto SET ? WHERE id = ?", [atualizado, id])

        res.json({
            sucesso: true,
            mensagem: "Produto deletado com sucesso"
        })
    } catch (erro) {
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao deletar produto",
            erro: erro.message
        })
    }
})

module.exports = app