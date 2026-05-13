const pool = require('../config/database');

class AnimalRepository {
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM animal ORDER BY id DESC');
        return rows;
    }

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM animal WHERE id = ?', [id]);
        return rows[0];
    }

    async create(animalData) {
        const { nome_pet, especie, raca, idade, nome_tutor, telefone_tutor } = animalData;
        const [result] = await pool.query(
            'INSERT INTO animal (nome_pet, especie, raca, idade, nome_tutor, telefone_tutor) VALUES (?, ?, ?, ?, ?, ?)',
            [nome_pet, especie, raca, idade, nome_tutor, telefone_tutor]
        );
        return result.insertId;
    }

    async update(id, animalData) {
        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(animalData)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        if (fields.length === 0) return null;

        values.push(id);
        const query = `UPDATE animal SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await pool.query(query, values);
        return result.affectedRows;
    }

    // TODO: Encontre-a no arquivo de trechos faltantes!
}

module.exports = new AnimalRepository();
