const UsuarioRepository = require('../repositories/UsuarioRepository')

class UsuarioService {
    async listarUsuarios() {
        const usuarios = await UsuarioRepository.findAll()
        return {
            sucesso: true,
            dados: usuarios,
            total: usuarios.length
        }
    }

    async buscarUsuarioPorId(id) {
        if (!id || isNaN(id)) {
            throw { status: 400, mensagem: "ID inválido!" }
        }

        const usuario = await UsuarioRepository.findById(id)
        if (!usuario) {
            throw {status: 404, mensagem: "Usuário não encontrado!"}
        }

        return {
            sucesso: true,
            dados: usuario
        }
    }

    async cadastrarUsuario(dados) {
        const {nome, email, senha, telefone, nivel_acesso, foto_perfil} = dados

        if (!nome || !email || !senha === undefined) {
            throw {status: 400, mensagem: "Nome, email e senha são itens obrigatórios!"}
        }

        const novoUsuario = {
            nome: nome.trim(),
            email: email,
            senha: senha,
            telefone: telefone,
            nivel_acesso: nivel_acesso,
            foto_perfil
        }

        const id = await UsuarioRepository.create(novoUsuario)
        return {
            sucesso: true, 
            mensagem: "Usuário cadastrado com sucesso!",
            id
        }
    }

    async atualizarUsuario(id, dados) {
        if (!id || isNaN(id)) {
            throw {status: 400, mensagem: "ID inválido!"}
        }

        const existe = await UsuarioRepository.findById(id)
        if(!existe) {
            throw {status: 404, mensagem: "Usuário não encontrado!"}
        }

        const atualizado = {}
        const {nome, email, senha, telefone, nivel_acesso, foto_perfil} = dados

        if (nome !== undefined) atualizado.nome = nome.trim()
        if (email !== undefined) atualizado.email = email
        if (senha !== undefined) atualizado.senha = senha
        if (telefone !== undefined) atualizado.telefone = telefone
        if (nivel_acesso !== undefined) atualizado.nivel_acesso = nivel_acesso
        if (foto_perfil !== undefined) atualizado.foto_perfil = foto_perfil

        if (Object.keys(atualizado).length === 0) {
            throw {status: 400, mensagem: "Nenhum dado válido enviado para atualização."}
        }

        await UsuarioRepository.update(id, atualizado)
        return {
            sucesso: true,
            mensagem: "Usuário atualizado com sucesso!"
        }
    }

    async deletarUsuario(id) {
        if (!id || isNaN(id)) {
            throw {status: 400, mensagem: "ID inválido!"}
        }

        const existe = await UsuarioRepository.findById(id)
        if(!existe) {
            throw {status: 404, mensagem: "Usuário não encontrado!"}
        }

        await UsuarioRepository.delete(id)
        return {
            sucesso: true, 
            mensagem: "Usuário apagado com sucesso!"
        }
    }
}

module.exports = new UsuarioService()