const express = require('express')
const pool = require('./config/database')

const app = express()

const queryAsync = (sql,values = []) => {
    return new Promise((resolve,reject) => {
        pool.query(sql, values, (err, results) => {
            if(err) reject(err)
                else resolve(results)
        })
    })
}   

app.use(express.json())

app.get('/', (req,res) => {
    res.send('API cinema está funcionando!')
})

app.get('/filmes', async (req,res) => {
   try {
    const filmes = await queryAsync('SELECT * FROM filme')
    res.json({
        sucesso: true,
        dados: filmes,
        total:filmes.length
   })
   } catch(erro) {
    console.error('Erro ao listar filmes:', erro)
    res.status(500).json({
    sucesso:false,
    mensagem: 'Erro ao listar filmes',
    erro: erro.message
    })
   }
})

app.get('/filmes/:id', async (req,res) => {
    try{
        const {id} = req.params

        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de filme inválido'
            })
        }

        const filme = await queryAsync('SELECT * FROM filme WHERE id = ?', [id])

        if(filme.length === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Filme não encontrado'
            })
        }

        res.json({
            sucesso: true,
            dados: filme[0]
        })
    } catch (erro) {
        console.error('Erro ao listar filmes:', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar filmes',
            erro: erro.message
        })
    }
   
})

app.post('/filmes', async (req,res) => {
    try {
        const {titulo, genero, duracao, classificacao, data_lancamento} = req.body

        if(!titulo || !genero || !duracao) {
            return res.status(400).json({
              sucesso: false,
              mensagem: 'Titulo, genero e duração são obrigatórios'    
            })
        
        }
        
        if(typeof duracao !== 'number' || duracao <=0)
            return res.status(400).json({
                sucesso:false,
                mensagem:'Duração deve ser um número negativo'
        })

        const novoFilme = {
            titulo:titulo.trim(),
            genero:genero.trim(),
            duracao:duracao,
            classificacao:classificacao || null,
            data_lancamento:data_lancamento || null,

        }

        const resultado = await queryAsync('INSERT INTO filme SET ?', [novoFilme]) 

        res.status(201).json({
            sucesso:true,
            mensagem:'Filme criado com sucesso',
            id:resultado.insertId
        })



    }catch (erro){
        console.error('Erro ao listar filmes:', erro)
        res.status(500).json({
            sucesso:false,
            mensagem: 'Erro ao listar filmes',
            erro: erro.message
        })
    }
})

app.put("/filmes/:id", async (req, res) =>{
    try {
        const {id} = req.params
        const {titulo, genero, duracao, classificacao, data_lancamento} = req.body

         if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de filme inválido'
            })
        }

        const filmeExiste = await queryAsync("SELECT * FROM filme WHERE id= ?", [id])
         if(filmeExiste.length === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Filme não encontrado'
            })
        }

        const filmeAtualizado = {}

        if(titulo !== undefined) filmeAtualizado.titulo = titulo.trim()
        if(genero !== undefined) filmeAtualizado.genero = genero.trim()
        if(duracao !== undefined) {
            if(typeof duracao !== "number" || duracao <=0)
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Duração deve ser positivo"
            
                })
                filmeAtualizado.duracao = duracao
        }
        if(classificacao !== undefined) filmeAtualizado.classificacao = classificacao.trim()
        if(data_lancamento !== undefined) filmeAtualizado.data_lancamento = data_lancamento

        if(Object.keys(filmeAtualizado).length ===0){
            return res.status(400).json({
                sucesso: false,
                mensagem: "Nenhum campo para atualizar"
            })
        }

        await queryAsync("UPDATE filme SET ? WHERE ?", [filmeAtualizado, id])
        res.json({
            sucesso: true,
            mensagem: "Filme atualizado!"
        })
    } catch (erro) {
        console.error("Erro ao atualizar filme", erro)
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao atualizar filme",
            erro: erro.mensage
        })
    }
})
app.delete('/filmes/:id', async (req,res) =>{
    try {
        const {id} = req.params

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de filme inválido.'
            })
        }

        const filmeExiste = await queryAsync('SELECT * FROM filme WHERE id = ?', [id])
       
        if (filmeExiste.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Filme não encontrado'
            })
        }

        await queryAsync('DELETE FROM filme WHERE id = ?',[id])

        res.json({
            sucesso: true,
            mensagem:'Filme apagado com sucesso'
        })


    } catch (erro) {
        console.error('Erro ao apagar filme', erro)
        res.status(500).json({
            sucesso: false,
            mensagem:'Erro ao apagar filme',
            erro: erro.message
        })
       
    }
})

app.get('/salas', async (req, res) => {
    try {
        const salas = await queryAsync('SELECT * FROM sala')

        res.json({
            sucesso: true,
            dados: salas,
            total: salas.length
        })
    } catch (erro) {
        console.error('Erro ao listar salas:', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar salas',
            erro: erro.message
        })
    }
})


app.get('/salas/:id', async (req, res) => {
    try {
        const { id } = req.params

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID inválido'
            })
        }

        const sala = await queryAsync('SELECT * FROM sala WHERE id = ?', [id])

        if (sala.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala não encontrada'
            })
        }

        res.json({
            sucesso: true,
            dados: sala[0]
        })

    } catch (erro) {
        console.error('Erro ao buscar sala:', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar sala',
            erro: erro.message
        })
    }
})


app.post('/salas', async (req, res) => {
    try {
        const { nome, capacidade } = req.body

        if (!nome || !capacidade) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nome e capacidade são obrigatórios'
            })
        }

        if (typeof capacidade !== 'number' || capacidade <= 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Capacidade inválida'
            })
        }

        const novaSala = {
            nome: nome.trim(),
            capacidade
        }

        const resultado = await queryAsync('INSERT INTO sala SET ?', [novaSala])

        res.status(201).json({
            sucesso: true,
            mensagem: 'Sala criada',
            id: resultado.insertId
        })

    } catch (erro) {
        console.error('Erro ao criar sala:', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao criar sala',
            erro: erro.message
        })
    }
})


app.
put('/salas/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { nome, capacidade } = req.body

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID inválido'
            })
        }

        const existe = await queryAsync('SELECT * FROM sala WHERE id = ?', [id])

        if (existe.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala não encontrada'
            })
        }

        const atualizado = {}

        if (nome !== undefined) atualizado.nome = nome.trim()

        if (capacidade !== undefined) {
            if (typeof capacidade !== 'number' || capacidade <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Capacidade inválida'
                })
            }
            atualizado.capacidade = capacidade
        }

        if (Object.keys(atualizado).length === 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nada para atualizar'
            })
        }

        await queryAsync('UPDATE sala SET ? WHERE id = ?', [atualizado, id])

        res.json({
            sucesso: true,
            mensagem: 'Sala atualizada'
        })

    } catch (erro) {
        console.error('Erro ao atualizar sala:', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao atualizar sala',
            erro: erro.message
        })
    }
})


app.delete('/salas/:id', async (req, res) => {
    try {
        const { id } = req.params

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID inválido'
            })
        }

        const existe = await queryAsync('SELECT * FROM sala WHERE id = ?', [id])

        if (existe.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala não encontrada'
            })
        }

        await queryAsync('DELETE FROM sala WHERE id = ?', [id])

        res.json({
            sucesso: true,
            mensagem: 'Sala removida'
        })

    } catch (erro) {
        console.error('Erro ao remover sala:', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao remover sala',
            erro: erro.message
        })
    }
})


app.get('/sessoes', async (req, res) => {
    try {
        const sessoes = await queryAsync('SELECT * FROM sessao')
        res.json({
            sucesso: true,
            dados: sessoes,
            total: sessoes.length
        })
    } catch (erro) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar sessões',
            erro: erro.message
        })
    }
})


app.get('/sessoes/:id', async (req, res) => {
    try {
        const { id } = req.params

        if (!id || isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' })
        }

        const sessao = await queryAsync('SELECT * FROM sessao WHERE id = ?', [id])

        if (sessao.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Sessão não encontrada' })
        }

        res.json({ sucesso: true, dados: sessao[0] })

    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar sessão', erro: erro.message })
    }
})

app.post('/sessoes', async (req, res) => {
    try {
        const { filme_id, sala_id, data_hora, preco } = req.body

        if (!filme_id || !sala_id || !data_hora || !preco) {
            return res.status(400).json({ sucesso: false, mensagem: 'Dados obrigatórios faltando' })
        }

        const novaSessao = { filme_id, sala_id, data_hora, preco }

        const result = await queryAsync('INSERT INTO sessao SET ?', [novaSessao])

        res.status(201).json({
            sucesso: true,
            mensagem: 'Sessão criada',
            id: result.insertId
        })

    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar sessão', erro: erro.message })
    }
})


app.put('/sessoes/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { filme_id, sala_id, data_hora, preco } = req.body

        if (!id || isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' })
        }

        const existe = await queryAsync('SELECT * FROM sessao WHERE id = ?', [id])

        if (existe.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Sessão não encontrada' })
        }

        const atualizado = {}

        if (filme_id !== undefined) atualizado.filme_id = filme_id
        if (sala_id !== undefined) atualizado.sala_id = sala_id
        if (data_hora !== undefined) atualizado.data_hora = data_hora
        if (preco !== undefined) atualizado.preco = preco

        await queryAsync('UPDATE sessao SET ? WHERE id = ?', [atualizado, id])

        res.json({ sucesso: true, mensagem: 'Sessão atualizada' })

    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar sessão', erro: erro.message })
    }
})


app.delete('/sessoes/:id', async (req, res) => {
    try {
        const { id } = req.params

        if (!id || isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' })
        }

        const existe = await queryAsync('SELECT * FROM sessao WHERE id = ?', [id])

        if (existe.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Sessão não encontrada' })
        }

        await queryAsync('DELETE FROM sessao WHERE id = ?', [id])

        res.json({ sucesso: true, mensagem: 'Sessão removida' })

    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao remover sessão', erro: erro.message })
    }
})


app.get('/ingressos', async (req, res) => {
    try {
        const ingressos = await queryAsync('SELECT * FROM ingresso')

        res.json({
            sucesso: true,
            dados: ingressos,
            total: ingressos.length
        })

    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar ingressos', erro: erro.message })
    }
})


app.get('/ingressos/:id', async (req, res) => {
    try {
        const { id } = req.params

        if (!id || isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' })
        }

        const ingresso = await queryAsync('SELECT * FROM ingresso WHERE id = ?', [id])

        if (ingresso.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Ingresso não encontrado' })
        }

        res.json({ sucesso: true, dados: ingresso[0] })

    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar ingresso', erro: erro.message })
    }
})


app.post('/ingressos', async (req, res) => {
    try {
        const { sessao_id, numero_assento, tipo, valor_pago, status } = req.body

        if (!sessao_id || !numero_assento || !tipo || !valor_pago) {
            return res.status(400).json({ sucesso: false, mensagem: 'Dados obrigatórios faltando' })
        }

        const novoIngresso = {
            sessao_id,
            numero_assento,
            tipo,
            valor_pago,
            status: status || 'reservado'
        }

        const result = await queryAsync('INSERT INTO ingresso SET ?', [novoIngresso])

        res.status(201).json({
            sucesso: true,
            mensagem: 'Ingresso criado',
            id: result.insertId
        })

    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar ingresso', erro: erro.message })
    }
})


app.put('/ingressos/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { sessao_id, numero_assento, tipo, valor_pago, status } = req.body

        if (!id || isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' })
        }

        const existe = await queryAsync('SELECT * FROM ingresso WHERE id = ?', [id])

        if (existe.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Ingresso não encontrado' })
        }

        const atualizado = {}

        if (sessao_id !== undefined) atualizado.sessao_id = sessao_id
        if (numero_assento !== undefined) atualizado.numero_assento = numero_assento
        if (tipo !== undefined) atualizado.tipo = tipo
        if (valor_pago !== undefined) atualizado.valor_pago = valor_pago
        if (status !== undefined) atualizado.status = status

        await queryAsync('UPDATE ingresso SET ? WHERE id = ?', [atualizado, id])

        res.json({ sucesso: true, mensagem: 'Ingresso atualizado' })

    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar ingresso', erro: erro.message })
    }
})

app.delete('/ingressos/:id', async (req, res) => {
    try {
        const { id } = req.params

        if (!id || isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' })
        }

        const existe = await queryAsync('SELECT * FROM ingresso WHERE id = ?', [id])

        if (existe.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Ingresso não encontrado' })
        }

        await queryAsync('DELETE FROM ingresso WHERE id = ?', [id])

        res.json({ sucesso: true, mensagem: 'Ingresso removido' })

    } catch (erro) {
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao remover ingresso', erro: erro.message })
    }
})

module.exports = app