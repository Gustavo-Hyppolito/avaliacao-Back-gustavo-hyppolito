const AnimalService = require('../services/AnimalService');

class AnimalController {
    // TODO: Ache-a no arquivo de trechos!

    async buscarPorId(req, res) {
        try {
            const resultado = await AnimalService.buscarAnimalPorId(req.params.id);
            res.json(resultado);
        } catch (erro) {
            res.status(erro.status || 500).json({ sucesso: false, mensagem: erro.mensagem || "Erro interno" });
        }
    }

    async cadastrar(req, res) {
        try {
            const resultado = await AnimalService.cadastrarAnimal(req.body);
            res.status(201).json(resultado);
        } catch (erro) {
            res.status(erro.status || 500).json({ sucesso: false, mensagem: erro.mensagem || "Erro interno" });
        }
    }

    async atualizar(req, res) {
        try {
            const resultado = await AnimalService.atualizarAnimal(req.params.id, req.body);
            res.json(resultado);
        } catch (erro) {
            res.status(erro.status || 500).json({ sucesso: false, mensagem: erro.mensagem || "Erro interno" });
        }
    }

    async deletar(req, res) {
        try {
            const resultado = await AnimalService.deletarAnimal(req.params.id);
            res.json(resultado);
        } catch (erro) {
            res.status(erro.status || 500).json({ sucesso: false, mensagem: erro.mensagem || "Erro interno" });
        }
    }
}

module.exports = new AnimalController();
