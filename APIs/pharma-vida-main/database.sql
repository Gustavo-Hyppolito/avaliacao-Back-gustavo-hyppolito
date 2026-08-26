CREATE DATABASE IF NOT EXISTS  pharmavida;
-- drop database pharmavida;
USE pharmavida;

-- 1. Tabela de Usuário
CREATE TABLE usuario (
	id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    nivel_acesso ENUM('Administrador', 'Gerente', 'Funcionário', 'Cliente'),
    status_user BOOLEAN DEFAULT TRUE
);

ALTER TABLE usuario ADD foto_perfil TEXT;

-- 2. Tabela de Cliente
CREATE TABLE cliente (
	id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    cep VARCHAR(15)
);

-- 3. Tabela do Fabricante
CREATE TABLE fabricante (
	id_fabricante INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(20),
    telefone VARCHAR(20),
    email VARCHAR(100)
);

-- 4. Tabela de Produto
CREATE TABLE produto (
	id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    armazenamento VARCHAR(100),
    localizacao VARCHAR(100),
    categoria VARCHAR(100) NOT NULL,
    id_fabricante INT,
    
    CONSTRAINT fk_produto_fabricante FOREIGN KEY (id_fabricante) REFERENCES fabricante(id_fabricante)
);

-- 5. Tabela de Lote
CREATE TABLE lote (
	id_lote INT AUTO_INCREMENT PRIMARY KEY,
    numero_lote VARCHAR(50) NOT NULL,
    validade DATE NOT NULL,
    quantidade INT NOT NULL,
    data_entrada DATE,
    id_produto INT NOT NULL,
    
    CONSTRAINT fk_lote_produto FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);

-- 6. Tabela de Estoque
CREATE TABLE estoque (
	id_estoque INT AUTO_INCREMENT PRIMARY KEY,
    quantidade_total INT NOT NULL,
    ultima_atualizacao DATETIME,
    id_produto INT UNIQUE,
    
    CONSTRAINT fk_estoque_produto FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);

-- 7. Tabela de Movimentação
CREATE TABLE movimentacao (
	id_movimentacao INT AUTO_INCREMENT PRIMARY KEY,
    tipo_movimentacao ENUM('Entrada', 'Saída', 'Devolução'),
    quantidade INT NOT NULL,
    data_movimentacao DATETIME NOT NULL,
    observacao TEXT,
    id_usuario INT NOT NULL,
    id_lote INT NOT NULL,
    
    CONSTRAINT fk_movimentacao_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
    CONSTRAINT fk_movimentacao_lote FOREIGN KEY (id_lote) REFERENCES lote (id_lote)
);

-- 8. Tabela de Pedido
CREATE TABLE pedido (
	id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    data_pedido DATE NOT NULL,
    status_pedido VARCHAR(30),
    valor_total DECIMAL(10,2),
    id_cliente INT NOT NULL,
    
    CONSTRAINT fk_pedido_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente)
);

-- 9. Tabela de Relação entre Item e Pedido
CREATE TABLE item_pedido (
	id_item_pedido INT AUTO_INCREMENT PRIMARY KEY,
    quantidade INT NOT NULL,
    valor_unitario DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    
    CONSTRAINT fk_itempedido_pedido FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido),
    CONSTRAINT fk_itempedido_produto FOREIGN KEY (id_produto) REFERENCES produto (id_produto)
);

-- 10. Tabela de Entrega
CREATE TABLE entrega (
	id_entrega INT AUTO_INCREMENT PRIMARY KEY,
    transportadora VARCHAR(100),
    motorista VARCHAR(100),
    horario_saida DATETIME,
    horario_entrega DATETIME,
    destino VARCHAR(255),
    condicoes_transporte VARCHAR(100),
    status_entrega VARCHAR(30),
    id_pedido INT UNIQUE,
    
    CONSTRAINT fk_entrega_pedido FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido)
);
