-- Execute este script no MySQL para criar o banco e a tabela

CREATE DATABASE IF NOT EXISTS agilepro;
USE agilepro;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  cargo VARCHAR(50) DEFAULT 'membro',   -- ex: admin, gerente, membro
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuário admin inicial (senha: admin123)
INSERT INTO usuarios (nome, email, senha, cargo) VALUES (
  'Administrador',
  'admin@agilepro.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'admin'
);
