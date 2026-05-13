const app = require('./app');
const pool = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3002;

async function startServer() {
    try {
        const connection = await pool.getConnection();
        console.log("Conexão com MySQL estabelecida na Veterinária! ✔️");
        connection.release();

        app.listen(PORT, () => {
            console.log(`Servidor da Clínica Veterinária rodando na porta ${PORT} 🐶`);
        });
    } catch (err) {
        console.error("Erro fatal ao conectar ao banco de dados:", err);
        process.exit(1);
    }
}

startServer();
