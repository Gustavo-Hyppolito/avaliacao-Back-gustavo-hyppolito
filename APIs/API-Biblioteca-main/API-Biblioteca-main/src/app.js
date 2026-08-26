import express from "express"

const app = express()

app.use(express.json())

const livros= [
    {
        isbn:1,
        titulo_livro: "Clash Royale",
        editora: "SuperCll",
        ano_publicacao: "2002"
    },
    {
        isbn:2,
        titulo_livro: "Harry Potter: A pedra filosofal",
        editora: "Saber",
        ano_publicacao: "2005"
    }
]

function buscarLivro(isbn){
    return livros.findIndex(livro =>{
        return livro.isbn === Number(isbn)
    })
}

app.get("/", (req,res) =>{
    res.status(200).send("Biblioteca Saber e Cia")
})

app.get("/livros", (req,res) => {
    res.status(200).json(livros)
})

app.get("/livros/:isbn", (req,res)=>{
    const index = buscarLivro(req.params.isbn)
    res.status(200).json(livros[index])
})

app.post("/livros", (req,res) => {
    livros.push(req.body)
    res.status(201).json(req.body)
})

app.put("/livros/:isbn", (req,res) => {
    const index = buscarLivro(req.params.isbn)

    livros[index].titulo_livro = req.body.titulo_livro
    livros[index].editora = req.body.editora
    livros[index].ano_publicacao = req.body.ano_publicacao

    res.status(200).json(livros[index])
})

app.delete("/livros/:isbn", (req,res) => {
    const index = buscarLivro(req.params.isbn)

    livros.splice(index, 1)
    res.status(200).send("Livro removido com sucesso")
})



const Autor= [
    {
        id_autor:1,
        nome: "Machado de Assis",
        nacionalidade: "Brasil",
      
    },
    {
        id_autor:2,
        nome: "JK",
        nacionalidade: "Reino Unido",
    }
]

function buscarautor(id_autor){
    return Autor.findIndex(Autor =>{
        return Autor.id_autor === Number(id_autor)
    })
}

app.get("/Autor", (req,res) => {
    res.status(200).json(Autor)
})

app.get("/Autor/:id_autor", (req,res)=>{
    const index = buscarautor(req.params.id_autor)
    res.status(200).json(Autor[index])
})

app.post("/Autor", (req,res) => {
    Autor.push(req.body)
    res.status(201).json(req.body)
})

app.put("/Autor/:id_autor", (req,res) => {
    const index = buscarautor(req.params.id_autor)
    
    Autor[index].nome = req.body.nome
    Autor[index].nacionalidade = req.body.nacionalidade

    res.status(200).json(Autor[index])
})

app.delete("/Autor/:id_autor", (req,res) => {
    const index = buscarautor(req.params.id_autor)

    livros.splice(index, 1)
    res.status(200).send("Autor removido com sucesso")
})

const autor_livro = [
    {
        id_autor:1,
        isbn: 1
    },
     {
        id_autor:2,
        isbn: 2
    },
]

function buscarAutorLivro(id_autor){
    return autor_livro.findIndex(AutorLivro =>{
        return AutorLivro.id_autor === Number(id_autor)
    })
}

app.get("/autor_livro", (req,res) => {
    res.status(200).json(autor_livro)
})

app.get("/autor_livro/:id_autor", (req,res)=>{
    const index = buscarAutorLivro(req.params.id_autor)
    res.status(200).json(autor_livro[index])
})

app.post("/autor_livro", (req,res) => {
    autor_livro.push(req.body)
    res.status(201).json(req.body)
})

app.put("/autor_livro/:id_autor", (req,res) => {
    const index = buscarAutorLivro(req.params.id_autor)

    autor_livro[index].id_autor = req.body.id_autor
    autor_livro[index].isbn = req.body.isbn

    res.status(200).json(autor_livro[index])
})

app.delete("/autor_livro/:id_autor", (req,res) => {
    const index = buscarAutorLivro(req.params.id_autor)

    autor_livro.splice(index, 1)
    res.status(200).send("Autor_livro Removido com sucesso!!")
})

const exemplar= [
    {
        id_exemplar:1,
        isbn:1,
        status:"Emprestado"
    },
     {
        id_exemplar:2,
        isbn:2,
        status:"Livre"
    },
]

function buscarexemplar(id_exemplar){
    return exemplar.findIndex(exemplar =>{
        return exemplar.id_exemplar === Number(id_exemplar)
    })
}

app.get("/exemplar", (req,res) => {
    res.status(200).json(exemplar)
})

app.get("/exemplar/:id_exemplar", (req,res)=>{
    const index = buscarAutorLivro(req.params.id_exemplar)
    res.status(200).json(exemplar[index])
})

app.post("/exemplar", (req,res) => {
    exemplar.push(req.body)
    res.status(201).json(req.body)
})

app.put("/exemplar/:id_exemplar", (req,res) => {
    const index = buscarAutorLivro(req.params.id_exemplar)

    exemplar[index].id_exemplar = req.body.id_exemplar
    exemplar[index].isbn = req.body.isbn

    res.status(200).json(exemplar[index])
})

app.delete("/exemplar/:id_exemplar", (req,res) => {
    const index = buscarexemplar(req.params.id_exemplar)

    exemplar.splice(index, 1)
    res.status(200).send("Exemplar Removido com sucesso!!")
})

const membro = [
    {
        id_membro:1,
        nome:"Heitor bobão",
        endereco:"Rua Eveigner"
        
    },
     {
       id_membro:2,
        nome:"Dutra bobão",
        endereco:"Rua Salvador"
        
    },
]

function buscarmembro(id_membro){
    return membro.findIndex(membro =>{
        return membro.id_membro === Number(id_membro)
    })
}

app.get("/membro", (req,res) => {
    res.status(200).json(membro)
})

app.get("/membro/:id_membro", (req,res)=>{
    const index = buscarmembro(req.params.id_membro)
    res.status(200).json(membro[index])
})

app.post("/membro", (req,res) => {
    membro.push(req.body)
    res.status(201).json(req.body)
})

app.put("/membro/:id_membro", (req,res) => {
    const index = buscarmembro(req.params.id_membro)

    membro[index].id_membro = req.body.id_membro
    membro[index].nome = req.body.nome

    res.status(200).json(membro[index])
})

app.delete("/membro/:id_membro", (req,res) => {
    const index = buscarmembro(req.params.id_membro)

    exemplar.splice(index, 1)
    res.status(200).send("Membro Removido com sucesso!!")
})

const emprestimo = [
    {
        id_emprestimo:1,
        data_emprestimo:"02/12/25",
        id_exemplar:1
        
    },
     {
         id_emprestimo:1,
        data_emprestimo:"02/12/25",
        id_exemplar:1
    },
]

function buscaremprestimo(id_emprestimo){
    return emprestimo.findIndex(emprestimo =>{
        return emprestimo.id_emprestimo=== Number(id_emprestimo)
    })
}

app.get("/emprestimo", (req,res) => {
    res.status(200).json(emprestimo)
})

app.get("/emprestimo/:id_emprestimo", (req,res)=>{
    const index = buscaremprestimo(req.params.id_emprestimo)
    res.status(200).json(emprestimo[index])
})

app.post("/emprestimo", (req,res) => {
    emprestimo.push(req.body)
    res.status(201).json(req.body)
})

app.put("/emprestimo/:id_emprestimo", (req,res) => {
    const index = buscaremprestimo(req.params.id_emprestimo)

    emprestimo[index].id_emprestimo = req.body.id_emprestimo
    emprestimo[index].data_emprestimo = req.body.data_emprestimo
    emprestimo[index].id_exemplar = req.body.id_exemplar

    res.status(200).json(emprestimo[index])
})

app.delete("/emprestimo/:id_emprestimo", (req,res) => {
    const index = buscaremprestimo(req.params.id_emprestimo)

    exemplar.splice(index, 1)
    res.status(200).send("Emprestimo Removido com sucesso!!")
})



export default app 

