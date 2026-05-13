# 🐶 Avaliação Prática: Reconstruindo a Veterinária API com MVC

**Objetivo:** Avaliar a sua capacidade de compreensão e estruturação de uma API RESTful em Node.js utilizando a Arquitetura MVC (Model-View-Controller).

## 🚨 O Problema

Nossa clínica veterinária contratou um desenvolvedor júnior para montar nossa API de controle de pacientes. No primeiro dia, ele fez uma grande confusão:
1. **Deletou** todas as pastas da estrutura MVC.
2. **Renomeou** todos os arquivos de código para nomes genéricos (`arquivo1.js`, `arquivo2.js`).
3. Ele ainda apagou alguns trechos de código e salvou todos misturados em um arquivo chamado `trechos_faltantes.txt`.

A API não funciona e a clínica não consegue cadastrar os pets!

---

## 🛠️ A Sua Missão

Você deve atuar como Desenvolvedor Pleno para reestruturar a API:

### Passo 1: Banco de Dados e Setup
1. Rode o script `database.sql` no MySQL para criar o banco `veterinaria_db`.
2. Ajuste suas senhas no `.env` e instale os pacotes com `npm install`.

### Passo 2: O Quebra-Cabeça
1. Entre na pasta `arquivos_base`.
2. Leia o código de cada arquivo. Identifique quem é Controller, Service, Repository, etc.
3. Crie a pasta `src` com as subpastas corretas (`controllers`, `services`, `repositories`, `routes`, `config`).
4. Renomeie os arquivos e mova-os para a estrutura correta.

### Passo 3: Código Perdido
1. Abra `trechos_faltantes.txt`.
2. Procure pelos comentários **`// TODO:`** nos arquivos que você organizou.
3. Descubra qual trecho pertence a qual arquivo e cole-os no lugar certo.

### Passo 4: Rodar e Validar
1. Suba a aplicação (`node src/server.js`).
2. Teste o CRUD completo no Insomnia/Postman na rota `/api/animais`.
3. Valide as regras de negócio de pacientes.

Entregue o link do repositório no GitHub. Bom trabalho! 🐾
