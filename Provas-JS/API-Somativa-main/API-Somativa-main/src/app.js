import express from "express"

const app = express()

app.use(express.json())

const filmes = [
    {
        id:1,
        nome: "soul",
        produtora: "disney",
        genero: "animação",
        ano_lancamento:2020,

    }
]

function buscarFilmes(id){
    return filmes.findIndex(filme => {
        return filme.id === Number(id)
    })

}

app.get("/", (req,res) => {
    res.status(200).send("Netflix e tudo a mais")
})

app.get("/filmes", (req,res) => {
    res.status(200).json(filmes)
})

app.get("/filmes/:id", (req,res) =>{
    const index = buscarFilmes(req.params.id)
    res.status(200).json(filmes[index])
})

app.post("/filmes", (req,res) => {
    filmes.push(req.body)
    res.status(201).json(req.body)
})//

app.put("/filmes/:id", (req,res) =>{
    const index = buscarFilmes(req.params.id)

    filmes[index].nome = req.body.nome
    filmes[index].produtora = req.body.produtora
    filmes[index].genero = req.body.genero 
    filmes[index].ano_lancamento = req.body.ano_lancamento

    res.status(200).json(filmes[index])
})

app.delete("/filmes/:id", (req,res) =>{
    const index = buscarFilmes(req.params.id)
    filmes.splice(index, 1)
    res.status(200).json(filmes)
})

export default app
