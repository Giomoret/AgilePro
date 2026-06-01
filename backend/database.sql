-- ============================================
-- AgilePro — Script completo do banco de dados
-- Execute este arquivo no MySQL Workbench
-- ============================================

CREATE DATABASE IF NOT EXISTS agilepro;
USE agilepro;

-- ─── Tabela de Usuários ───────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  cargo VARCHAR(50) DEFAULT 'membro',
  cargo_display VARCHAR(50) DEFAULT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Tabela de Projetos ───────────────────────
CREATE TABLE IF NOT EXISTS projetos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  status VARCHAR(50) DEFAULT 'Ativo',
  cor VARCHAR(20) DEFAULT '#378ADD',
  etiquetas VARCHAR(255) DEFAULT '',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Membros por Projeto (N:N) ────────────────
CREATE TABLE IF NOT EXISTS projeto_membros (
  projeto_id INT NOT NULL,
  usuario_id INT NOT NULL,
  PRIMARY KEY (projeto_id, usuario_id),
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ─── Tabela de Tarefas ────────────────────────
CREATE TABLE IF NOT EXISTS tarefas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  notas TEXT,
  prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media',
  status ENUM('a-fazer', 'em-progresso', 'concluido') DEFAULT 'a-fazer',
  data_limite DATE,
  sprint VARCHAR(10) DEFAULT '1',
  projeto_id INT NOT NULL,
  subtarefas JSON DEFAULT NULL,
  comentarios JSON DEFAULT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
);

-- ─── Responsáveis por Tarefa (N:N) ───────────
CREATE TABLE IF NOT EXISTS tarefa_responsaveis (
  tarefa_id INT NOT NULL,
  usuario_id INT NOT NULL,
  PRIMARY KEY (tarefa_id, usuario_id),
  FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ─── Usuário admin inicial (senha: admin123) ──
INSERT INTO usuarios (nome, email, senha, cargo, cargo_display) VALUES (
  'Administrador',
  'admin@agilepro.com',
  '$2a$10$BrkORMKrcxdlq4DlTh7WVO3iQmlPSmQ4E1whLUPJZW4/TnfPa71E6',
  'admin',
  'Administrador'
);