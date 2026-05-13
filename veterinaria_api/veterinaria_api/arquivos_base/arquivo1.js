const AnimalRepository = require('../repositories/AnimalRepository');

class AnimalService {
    async listarAnimais() {
        const animais = await AnimalRepository.findAll();
        return { sucesso: true, dados: animais, total: animais.length };
    }

    async buscarAnimalPorId(id) {
        if (!id || isNaN(id)) throw { status: 400, mensagem: "ID inválido" };
        const animal = await AnimalRepository.findById(id);
        if (!animal) throw { status: 404, mensagem: "Paciente não encontrado" };
        return { sucesso: true, dados: animal };
    }

    // TODO: Busque no arquivo de trechos.

    async atualizarAnimal(id, dados) {
        if (!id || isNaN(id)) throw { status: 400, mensagem: "ID inválido" };
        
        const existe = await AnimalRepository.findById(id);
        if (!existe) throw { status: 404, mensagem: "Paciente não encontrado" };

        const atualizado = {};
        const { nome_pet, especie, raca, idade, nome_tutor, telefone_tutor } = dados;

        if (nome_pet !== undefined) atualizado.nome_pet = nome_pet.trim();
        if (especie !== undefined) atualizado.especie = especie.trim();
        if (raca !== undefined) atualizado.raca = raca.trim();
        if (idade !== undefined) {
            if (typeof idade !== "number" || idade < 0) throw { status: 400, mensagem: "Idade inválida" };
            atualizado.idade = idade;
        }
        if (nome_tutor !== undefined) atualizado.nome_tutor = nome_tutor.trim();
        if (telefone_tutor !== undefined) atualizado.telefone_tutor = telefone_tutor.trim();

        if (Object.keys(atualizado).length === 0) throw { status: 400, mensagem: "Nenhum dado válido" };

        await AnimalRepository.update(id, atualizado);
        return { sucesso: true, mensagem: "Ficha do paciente atualizada com sucesso" };
    }

    async deletarAnimal(id) {
        if (!id || isNaN(id)) throw { status: 400, mensagem: "ID inválido" };
        const existe = await AnimalRepository.findById(id);
        if (!existe) throw { status: 404, mensagem: "Paciente não encontrado" };

        await AnimalRepository.delete(id);
        return { sucesso: true, mensagem: "Registro apagado com sucesso" };
    }
}

module.exports = new AnimalService();
