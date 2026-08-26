const pool = require('../config/database')

class UsuarioRepository {
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM usuario')
        return rows
    }

    async findById(id_usuario) {
        const [rows] = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [id_usuario])
        return rows[0]
    }

    async create(usuarioData) {
        const {nome, email, senha, telefone, nivel_acesso, foto_perfil} = usuarioData
        const [resultado] = await pool.query(
            'INSERT INTO usuario (nome, email, senha, telefone, nivel_acesso, foto_perfil) VALUES (?,?,?,?,?,?)', [nome, email, senha, telefone, nivel_acesso, foto_perfil]
        )
        return resultado.insertId
    }

    async update(id_usuario, usuarioData) {
        const fields = []
        const values = []

        for (const [key, value] of Object.entries(usuarioData)) {
            fields.push(`${key} = ?`)
            values.push(value)
        }

        if (fields.length === 0 ) return null

        values.push(id_usuario)
        const query = `UPDATE usuario SET ${fields.join(', ')} WHERE id_usuario = ?`
        const [resultado] = await pool.query(query, values)
        return resultado.affectedRows
    }

    async delete(id_usuario) {
        const [resultado] = await pool.query('DELETE FROM usuario WHERE id_usuario = ?', [id_usuario])
        return resultado.affectedRows
    }
}

module.exports = new UsuarioRepository()