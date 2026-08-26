import express from 'express'

const app = express()

app.use(express.json())

const produts = []

app.listen(9000, () => console.log("Servidor está rodando na porta 8001"))

app.get('/produtos', (req, res) => {
    res.status(200).json(produts)
})

app.post('/produtos', (req, res) => {
    produts.push(req.body)

    res.status(201).json(req.body)
})
