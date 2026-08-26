const UsuarioService = require('../services/UsuarioServices')

class UsuarioController {
    async listar(req, res) {
        try {
            const resultado = await UsuarioService.listarUsuarios()
            res.json(resultado)
        } catch (error) {
            res.status(error.status || 500).json({
                sucesso: false,
                mensagem: error.mensagem || "Erro interno do servidor",
                error: error.stack || error
            })
        }
    }

    async buscarPorId(req, res) {
        try {
            const resultado = await UsuarioService.buscarUsuarioPorId(req.params.id)
            res.json(resultado)
        } catch (error) {
            res.status(error.status || 500).json({
                sucesso: false,
                mensagem: error.mensagem || "Erro interno do servidor",
                error: error.stack || error
            })
        }
    }

    async cadastrar(req, res) {
        try {
            const dadosUsuario = {...req.body, foto_perfil: req.file ? req.file.filename : null}
            const resultado = await UsuarioService.cadastrarUsuario(dadosUsuario)
            res.status(201).json(resultado)
        } catch (error) {
            res.status(error.status || 500).json({
                sucesso: false,
                mensagem: error.mensagem || "Erro interno do servidor",
                error: error.stack || error
            })
        }
    }

    async atualizar(req, res) {
        try {
            const resultado = await UsuarioService.atualizarUsuario(req.params.id, req.body)
            res.json(resultado)
        } catch (error) {
            res.status(error.status || 500).json({
                sucesso: false,
                mensagem: error.mensagem || "Erro interno do servidor",
                error: error.stack || error
            })
        }
    }

    async deletar(req, res) {
        try {
            const resultado = await UsuarioService.deletarUsuario(req.params.id)
            res.json(resultado)
        } catch (error) {
            res.status(error.status || 500).json({
                sucesso: false,
                mensagem: error.mensagem || "Erro interno do servidor",
                error: error.stack || error
            })
        }
    }
}

module.exports = new UsuarioController();