const validarExistencia = (resultado, res, tipo) => {
    if (resultado.length === 0) {
        res.status(404).json({
            sucesso: false,
            mensagem: `${tipo} não encontrado`
        })
        return false
    }
    return true
}


//Exercício 1
app.get('/usuarios', async (req, res) => {
    try {
        const listaUsuarios = await queryAsync("SELECT * FROM usuarios")

        res.status(200).json({
            sucesso: true,
            dados: listaUsuarios,
            total: listaUsuarios.length
        })
    } catch (erro) {
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao listar usuário",
        })
    }
})

app.get('/usuarios/:id', async (req, res) => {
    try {
        const {id} = req.params
        const usuario = await queryAsync("SELECT * FROM usuarios WHERE id = ?", [id])

        if (!validarExistencia(usuario, res, "Usuário")) {
            return
        }
        res.status(200).json({
            sucesso: true,
            dados: usuario[0]
        })
    } catch (erro) {
        res.status(500).json({
            sucesso: false, 
            mensagem: "Erro ao buscar usuário",
        })
    }
})


//Exercício 2
const validarDados = (cliente, valor) => {
    if (!cliente || !valor) {
        return "Clientes e valor são obrigatórios"
    }
    if (typeof valor !== "number" || valor <= 0) {
        return "Valor inválido"
    }
    return null //null é porque são para valores válidos
}
 
app.post('/pedidos', async (req, res) => {
    try {
        const erro = validarDados(req.body)
        if (erro) {
            return res.status(400).json({
                sucesso: false,
                mensagem: erro
                //400 é para erros de cliente; quando o cliente envia dados inválidos
            })
        }
        await queryAsync( "INSERT INTO pedidos SET?", [req.body])

        res.status(201).json({
            sucesso: true,
            mensagem: "Pedido cAdrastrado"
        })

} catch (erro) {
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao cadastrar pedido"
            //500 é para erros de servidor; quando algo deu errado no servidor
        })
    }
})


//Exercício 3
app.put('/salas/:id', async (req, res) => {
    try {
        const {id} = req.params
        const dados = req.body

        const sala = await queryAsync(
            "SELECT * FROM sala WHERE id = ?", [id])

        if (!validarExistencia(sala, res, "Sala")) {
            return
        }

        if (Object.keys(dados).length === 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Nenhum dado enviado"
            })
        }

        await queryAsync("SELECT * FROM sala WHERE id = ?", [dados, id])

        res.status(200).json({
            sucesso: true,
            mensagem: "Sala atualizada"
        })
    } catch (erro) {
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao atualizar sala",
        })
    }
})

app.delete('/salas/:id', async (req, res) => {
    try {
        const {id} = req.params
       

        const sala = await queryAsync( "SELECT * FROM sala WHERE id = ?", [id])

        if (!validarExistencia(sala, res, "Sala")) {
            return
        }

        await queryAsync("SELECT * FROM sala WHERE id = ?", [id])

        res.status(200).json({
            sucesso: true,
            mensagem: "Sala removida"
        })
    } catch(erro) {
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao remover sala",
        })
    }
})
