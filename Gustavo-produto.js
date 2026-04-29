app.put("/prod/update/:id_prod", async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;
    const produto = await queryAsync("SELECT * FROM produtos WHERE id = ?", [
      id,
    ]);

    if (Object.keys(dados).length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Nenhum dado enviado",
      });
    }

    const erro = (dadosNome, dadosValor) => {
      if (typeof dadosValor !== "number" || dadosValor > 0) {
        return "Valor inválido";
      }
      if (typeof dadosNome !== "string") {
        return "Nome inválido";
      }
      if (erro) {
        return res.status(400).json({
          sucesso: false,
          mensagem: erro,
          //400 é para quando o cliente envia dados inválidos
        });
      }
    };

    await queryAsync("UPDATE produtos SET ? WHERE id = ?", [dados, id]);

    res.status(201).json({
      sucesso: true,
      mensagem: "Produto cadrastrado",
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao cadastrar pedido",
      //500 é para erros de servidor;
    });
  }
});
