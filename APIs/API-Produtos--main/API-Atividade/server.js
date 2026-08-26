import express from 'express'

const app = express()

app.use(express.json())

const users = []

app.listen(8000, () => console.log("Servidor está acontecendo/ rodando na porta 8000"))

app.get('/usuarios', (req, res) => {
    res.status(200).json(users)
})

app.post('/usuarios', (req, res) => {
    users.push(req.body)

    res.status(20).json(req.body)
})

