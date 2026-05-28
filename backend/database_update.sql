-- Execute este script no MySQL Workbench para atualizar o banco
USE agilepro;

-- Tabela de Projetos
CREATE TABLE IF NOT EXISTS projetos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  status VARCHAR(50) DEFAULT 'Ativo',
  cor VARCHAR(20) DEFAULT '#378ADD',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Membros do Projeto (relação N:N entre projetos e usuários)
CREATE TABLE IF NOT EXISTS projeto_membros (
  projeto_id INT NOT NULL,
  usuario_id INT NOT NULL,
  PRIMARY KEY (projeto_id, usuario_id),
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Tarefas
CREATE TABLE IF NOT EXISTS tarefas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  notas TEXT,
  prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media',
  status ENUM('a-fazer', 'em-progresso', 'concluido') DEFAULT 'a-fazer',
  data_limite DATE,
  sprint VARCHAR(10) DEFAULT '1',
  projeto_id INT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
);

-- Tabela de Responsáveis por Tarefa (relação N:N entre tarefas e usuários)
CREATE TABLE IF NOT EXISTS tarefa_responsaveis (
  tarefa_id INT NOT NULL,
  usuario_id INT NOT NULL,
  PRIMARY KEY (tarefa_id, usuario_id),
  FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Dados iniciais de exemplo
INSERT INTO projetos (nome, descricao, status, cor) VALUES
  ('AgilePro', 'Sistema de gestão ágil de projetos', 'Ativo', '#534AB7'),
  ('Dashboard Analytics', 'Painel de métricas e relatórios', 'Ativo', '#1D9E75'),
  ('App Mobile', 'Aplicativo mobile multiplataforma', 'Ativo', '#378ADD');
