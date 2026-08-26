# Tutorial: Implementando Upload de Imagens com Node.js e Multer

Este tutorial detalha as etapas necessárias para adicionar o recurso de upload de imagens na API `sabor_digital` utilizando a arquitetura MVC. O objetivo é permitir que produtos tenham imagens associadas, e que o servidor gerencie os arquivos físicos de forma limpa (sem acumular arquivos não utilizados).

---

## 1. O que é o Multer?
Quando enviamos arquivos através de um formulário ou aplicativo, não podemos usar o padrão JSON comum. Precisamos enviar os dados no formato `multipart/form-data`.
O `multer` é um *middleware* para o Express (Node.js) responsável especificamente por ler esse tipo de requisição, extrair os arquivos de imagem e salvá-los no disco do servidor.

**Comando de instalação executado:**
```bash
npm install multer
```

---

## 2. Preparando o Banco de Dados
Para armazenar qual imagem pertence a qual produto, o banco de dados precisa guardar o caminho (o endereço textual) de onde o arquivo foi salvo no servidor.

No MySQL, executamos a seguinte alteração na tabela `produto` para adicionar a coluna `imagem`:
```sql
ALTER TABLE produto ADD COLUMN imagem VARCHAR(255) DEFAULT NULL;
```
*(Essa mesma linha foi adicionada ao seu arquivo `database.sql` para futuras criações do banco)*.

---

## 3. Configuração do Multer (O "Cérebro" do Upload)
Criamos um arquivo de configuração isolado em `src/config/multer.js`. Ele dita as regras de como e onde as imagens serão salvas.

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garante que a pasta 'public/uploads/produtos' sempre exista
const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'produtos');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configura o armazenamento em disco
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Define o destino como a pasta criada acima
    },
    filename: function (req, file, cb) {
        // Renomeia o arquivo com a data atual (timestamp) para nunca haver nomes iguais
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtra para aceitar apenas formatos de imagem
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Apenas arquivos de imagem são permitidos.'));
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = upload;
```

---

## 4. Servindo Imagens pelo Express (App.js)
De nada adianta salvar a imagem se o aplicativo Front-end não puder acessá-la. Para transformar a pasta `public` num diretório "aberto" (como se fosse um servidor web Apache/Nginx), adicionamos uma linha no `src/app.js`:

```javascript
const path = require('path');

// Toda vez que alguém acessar a URL /public, o express vai buscar arquivos na pasta física 'public'
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
```
Isso permite que um frontend use a tag HTML: `<img src="http://localhost:3000/public/uploads/produtos/12345.jpg">`.

---

## 5. Aplicando o Middleware nas Rotas
No MVC, as rotas (`src/routes/produtoRoutes.js`) controlam as portas de entrada. Injetamos o middleware `upload.single('imagem')` nas rotas que precisam receber arquivos.
`'imagem'` é o nome exato do campo que o front-end precisará enviar contendo o arquivo.

```javascript
const upload = require('../config/multer');

// Intercepta a requisição, salva a imagem, e SÓ ENTÃO chama o ProdutoController
router.post('/', upload.single('imagem'), ProdutoController.cadastrar);
router.put('/:id', upload.single('imagem'), ProdutoController.atualizar);
```

---

## 6. Lógica no Controller
No `ProdutoController.js`, a requisição agora chega com dois atributos distintos vindos do front-end:
1. `req.body`: Contendo os campos de texto (nome, descrição, preço).
2. `req.file`: Contendo os metadados do arquivo recém-salvo pelo Multer.

Nós juntamos os dois antes de mandar para o Service processar a regra de negócio:
```javascript
async cadastrar(req, res) {
    // Une o corpo (body) com o arquivo (file) num único objeto
    const dados = { ...req.body, file: req.file };
    const resultado = await ProdutoService.cadastrarProduto(dados);
    res.status(201).json(resultado);
}
```

---

## 7. Regras de Negócio no Service (A Mágica)
O `ProdutoService.js` é a camada mais complexa, pois deve garantir que o sistema de arquivos e o banco de dados estejam sincronizados. Importamos o `fs.promises` para apagar os arquivos quando necessário.

### A. Cadastro
Como usamos `multipart/form-data`, tudo o que é enviado via front-end chega como Texto (`string`), até mesmo os números. Por isso, a primeira coisa é converter os dados:
```javascript
// Conversão de string para float
if (typeof preco === 'string') {
    preco = parseFloat(preco);
}
```
Em seguida, validamos se existe o campo `file`. Se existir, criamos o caminho (path) para salvar no banco.
```javascript
const novoProduto = {
    nome, descricao, preco, categoria,
    // Se enviou imagem, monta o caminho, se não, salva null
    imagem: file ? `uploads/produtos/${file.filename}` : null,
    disponivel
};
```

### B. Atualização e Exclusão Segura
Se o produto for apagado (ou a imagem substituída), temos que ir lá na pasta `public/uploads/produtos` e **apagar o arquivo físico** para que o disco não encha de lixo ao longo do tempo.

```javascript
// Exemplo retirado da lógica de DeletarProduto:
const existe = await ProdutoRepository.findById(id);

// Se o produto que está sendo apagado tinha uma imagem...
if (existe.imagem) {
    // Encontra a rota absoluta do arquivo físico
    const caminho = path.join(__dirname, '..', '..', 'public', existe.imagem);
    try {
        await fs.unlink(caminho); // fs.unlink apaga o arquivo do disco rígido
    } catch (err) {
        console.error("Erro ao apagar imagem", err);
    }
}
// Só então apagamos do Banco de Dados
await ProdutoRepository.delete(id);
```

---

## 8. Persistência no Repositório
Por fim, atualizamos o `ProdutoRepository.js` no método `create` para que a query SQL entenda a nova coluna de imagem e insira o caminho (que o Service passou como texto).

```javascript
async create(produtoData) {
    const { nome, descricao, preco, categoria, imagem, disponivel } = produtoData;
    const [result] = await pool.query(
        'INSERT INTO produto (nome, descricao, preco, categoria, imagem, disponivel) VALUES (?, ?, ?, ?, ?, ?)',
        [nome, descricao, preco, categoria, imagem, disponivel]
    );
    return result.insertId;
}
```

## Como Testar a API Agora?
No seu Postman, Insomnia ou Thunder Client:
1. Crie uma requisição POST para `/produtos`.
2. Em vez de enviar pelo formato `JSON`, mude a aba do Body para `Multipart Form` ou `Form Data`.
3. Adicione as chaves: `nome`, `descricao`, `preco`, etc... digitando os valores normalmente.
4. Adicione a chave `imagem`, mude o tipo dela de `Text` para `File` na ferramenta, e selecione uma foto do seu computador.
5. Ao enviar, o back-end vai guardar a foto na pasta e registrar no banco!
