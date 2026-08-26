-- Script do banco da Clínica Veterinária
CREATE DATABASE IF NOT EXISTS veterinaria_db;
USE veterinaria_db;

CREATE TABLE IF NOT EXISTS animal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_pet VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(50) DEFAULT NULL,
    idade INT DEFAULT 0,
    nome_tutor VARCHAR(100) NOT NULL,
    telefone_tutor VARCHAR(20) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO animal (nome_pet, especie, raca, idade, nome_tutor, telefone_tutor) VALUES 
('Rex', 'Cachorro', 'Labrador', 3, 'Carlos Silva', '(11) 99999-1111'),
('Mia', 'Gato', 'Siamês', 1, 'Ana Santos', '(11) 98888-2222'),
('Bidu', 'Cachorro', 'Poodle', 5, 'João Paulo', '(11) 97777-3333');
