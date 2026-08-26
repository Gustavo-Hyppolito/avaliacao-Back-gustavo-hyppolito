const app = require('./app')
const pool = require('./config/database')

const PORT = 3000

// Testando conexão
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err)
        process.exit(1)
    }

    console.log("Conexão com MySQL estabelecida! ✔️")
    connection.release()
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} 🚀`)
})