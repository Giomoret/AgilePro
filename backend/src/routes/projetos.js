const express = require("express");
const router = express.Router();
const db = require("../db");
const { autenticar } = require("../middlewares/auth");

// GET /projetos — Lista todos os projetos com seus membros
router.get("/", autenticar, async (req, res) => {
  try {
    const [projetos] = await db.query(
      "SELECT * FROM projetos ORDER BY criado_em DESC"
    );

    // Para cada projeto, busca os membros
    for (const projeto of projetos) {
      const [membros] = await db.query(
        `SELECT u.id, u.nome, u.email, u.cargo
         FROM usuarios u
         INNER JOIN projeto_membros pm ON u.id = pm.usuario_id
         WHERE pm.projeto_id = ?`,
        [projeto.id]
      );
      projeto.membros = membros;
    }

    res.json(projetos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar projetos." });
  }
});

// GET /projetos/:id — Busca projeto por ID
router.get("/:id", autenticar, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM projetos WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ erro: "Projeto não encontrado." });

    const projeto = rows[0];
    const [membros] = await db.query(
      `SELECT u.id, u.nome, u.email, u.cargo
       FROM usuarios u
       INNER JOIN projeto_membros pm ON u.id = pm.usuario_id
       WHERE pm.projeto_id = ?`,
      [id]
    );
    projeto.membros = membros;

    res.json(projeto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar projeto." });
  }
});

// POST /projetos — Cria novo projeto
router.post("/", autenticar, async (req, res) => {
  const { nome, descricao, status, cor, membros } = req.body;

  if (!nome) return res.status(400).json({ erro: "Nome é obrigatório." });

  try {
    const [result] = await db.query(
      "INSERT INTO projetos (nome, descricao, status, cor) VALUES (?, ?, ?, ?)",
      [nome, descricao || "", status || "Ativo", cor || "#378ADD"]
    );

    const projetoId = result.insertId;

    // Insere membros se fornecidos
    if (Array.isArray(membros) && membros.length > 0) {
      const valores = membros.map((uid) => [projetoId, uid]);
      await db.query("INSERT INTO projeto_membros (projeto_id, usuario_id) VALUES ?", [valores]);
    }

    res.status(201).json({ mensagem: "Projeto criado com sucesso!", id: projetoId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar projeto." });
  }
});

// PUT /projetos/:id — Atualiza projeto
router.put("/:id", autenticar, async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, status, cor, membros } = req.body;

  try {
    const [existe] = await db.query("SELECT id FROM projetos WHERE id = ?", [id]);
    if (existe.length === 0) return res.status(404).json({ erro: "Projeto não encontrado." });

    const campos = [];
    const valores = [];

    if (nome) { campos.push("nome = ?"); valores.push(nome); }
    if (descricao !== undefined) { campos.push("descricao = ?"); valores.push(descricao); }
    if (status) { campos.push("status = ?"); valores.push(status); }
    if (cor) { campos.push("cor = ?"); valores.push(cor); }

    if (campos.length > 0) {
      valores.push(id);
      await db.query(`UPDATE projetos SET ${campos.join(", ")} WHERE id = ?`, valores);
    }

    // Atualiza membros: remove todos e reinsere
    if (Array.isArray(membros)) {
      await db.query("DELETE FROM projeto_membros WHERE projeto_id = ?", [id]);
      if (membros.length > 0) {
        const vals = membros.map((uid) => [id, uid]);
        await db.query("INSERT INTO projeto_membros (projeto_id, usuario_id) VALUES ?", [vals]);
      }
    }

    res.json({ mensagem: "Projeto atualizado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar projeto." });
  }
});

// DELETE /projetos/:id — Remove projeto
router.delete("/:id", autenticar, async (req, res) => {
  const { id } = req.params;
  try {
    const [existe] = await db.query("SELECT id FROM projetos WHERE id = ?", [id]);
    if (existe.length === 0) return res.status(404).json({ erro: "Projeto não encontrado." });

    await db.query("DELETE FROM projetos WHERE id = ?", [id]);
    res.json({ mensagem: "Projeto deletado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao deletar projeto." });
  }
});

module.exports = router;
