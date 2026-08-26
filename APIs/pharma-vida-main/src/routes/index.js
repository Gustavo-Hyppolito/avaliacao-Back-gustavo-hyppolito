const express = require('express');
const router = express.Router();

const usuarioRoutes = require('./usuarioRoutes');
const clienteRoutes = require('./clienteRoutes');
const fabricanteRoutes = require('./fabricanteRoutes');
const produtoRoutes = require('./produtoRoutes');
const loteRoutes = require('./loteRoutes');
const estoqueRoutes = require('./estoqueRoutes');
const movimentacaoRoutes = require('./movimentacaoRoutes')
const pedidoRoutes = require('./pedidoRoutes');
const itemPedidoRoutes = require('./itemPedidoRoutes');
const entregaRoutes = require('./entregaRoutes');

// Rota base (Root endpoint que estava em app.js)
router.get('/', (req, res) => {
    res.json({
        mensagem: "API PharmaVida funcionando 🍝",
        versao: "1.0.0",
        arquitetura: "MVC + SOLID"
    });
});

// Registrar domínios de rotas
router.use('/usuarios', usuarioRoutes);

/*
router.use('/clientes', clienteRoutes);
router.use('/fabricantes', fabricanteRoutes);
router.use('/produtos', produtoRoutes);
router.use('/lotes', loteRoutes);
router.use('/estoques', estoqueRoutes);
router.use('/movimentacoes', movimentacaoRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/itens-pedido', itemPedidoRoutes);
router.use('/entregas', entregaRoutes);*/

module.exports = router;