-- Script do banco da Conveniência
CREATE DATABASE IF NOT EXISTS conveniencia_db;
USE conveniencia_db;

CREATE TABLE IF NOT EXISTS produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    categoria VARCHAR(50) DEFAULT NULL,
    disponivel BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO produto (nome, descricao, preco, estoque, categoria, disponivel) VALUES 
('Refrigerante Cola 350ml', 'Lata gelada', 5.50, 50, 'Bebida', true),
('Salgadinho de Queijo', 'Pacote 90g', 4.00, 30, 'Snack', true),
('Chocolate ao Leite', 'Barra 90g', 6.50, 20, 'Doce', true);
