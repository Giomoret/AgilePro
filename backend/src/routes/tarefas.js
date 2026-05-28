const express = require("express");
const router = express.Router();
const db = require("../db");
const { autenticar } = require("../middlewares/auth");

// GET /tarefas?projeto_id=X&sprint=Y
router.get("/", autenticar, async (req, res) => {
  const { projeto_id, sprint } = req.query;

  if (!projeto_id) return res.status(400).json({ erro: "projeto_id é obrigatório." });

  try {
    const params = [projeto_id];
    let query = "SELECT * FROM tarefas WHERE projeto_id = ?";

    if (sprint) {
      query += " AND sprint = ?";
      params.push(sprint);
    }

    query += " ORDER BY criado_em ASC";
    const [tarefas] = await db.query(query, params);

    // Para cada tarefa, busca os responsáveis
    for (const tarefa of tarefas) {
      const [responsaveis] = await db.query(
        `SELECT u.id, u.nome, u.email
         FROM usuarios u
         INNER JOIN tarefa_responsaveis tr ON u.id = tr.usuario_id
         WHERE tr.tarefa_id = ?`,
        [tarefa.id]
      );
      tarefa.responsaveis = responsaveis;
    }

    res.json(tarefas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar tarefas." });
  }
});

// POST /tarefas — Cria nova tarefa
router.post("/", autenticar, async (req, res) => {
  const { titulo, notas, prioridade, status, data_limite, sprint, projeto_id, responsaveis } = req.body;

  if (!titulo || !projeto_id) {
    return res.status(400).json({ erro: "Título e projeto_id são obrigatórios." });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO tarefas (titulo, notas, prioridade, status, data_limite, sprint, projeto_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        notas || "",
        prioridade || "media",
        status || "a-fazer",
        data_limite || null,
        sprint || "1",
        projeto_id,
      ]
    );

    const tarefaId = result.insertId;

    if (Array.isArray(responsaveis) && responsaveis.length > 0) {
      const vals = responsaveis.map((uid) => [tarefaId, uid]);
      await db.query("INSERT INTO tarefa_responsaveis (tarefa_id, usuario_id) VALUES ?", [vals]);
    }

    res.status(201).json({ mensagem: "Tarefa criada com sucesso!", id: tarefaId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar tarefa." });
  }
});

// PUT /tarefas/:id — Atualiza tarefa
router.put("/:id", autenticar, async (req, res) => {
  const { id } = req.params;
  const { titulo, notas, prioridade, status, data_limite, sprint, responsaveis } = req.body;

  try {
    const [existe] = await db.query("SELECT id FROM tarefas WHERE id = ?", [id]);
    if (existe.length === 0) return res.status(404).json({ erro: "Tarefa não encontrada." });

    const campos = [];
    const valores = [];

    if (titulo) { campos.push("titulo = ?"); valores.push(titulo); }
    if (notas !== undefined) { campos.push("notas = ?"); valores.push(notas); }
    if (prioridade) { campos.push("prioridade = ?"); valores.push(prioridade); }
    if (status) { campos.push("status = ?"); valores.push(status); }
    if (data_limite !== undefined) { campos.push("data_limite = ?"); valores.push(data_limite || null); }
    if (sprint) { campos.push("sprint = ?"); valores.push(sprint); }

    if (campos.length > 0) {
      valores.push(id);
      await db.query(`UPDATE tarefas SET ${campos.join(", ")} WHERE id = ?`, valores);
    }

    if (Array.isArray(responsaveis)) {
      await db.query("DELETE FROM tarefa_responsaveis WHERE tarefa_id = ?", [id]);
      if (responsaveis.length > 0) {
        const vals = responsaveis.map((uid) => [id, uid]);
        await db.query("INSERT INTO tarefa_responsaveis (tarefa_id, usuario_id) VALUES ?", [vals]);
      }
    }

    res.json({ mensagem: "Tarefa atualizada com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar tarefa." });
  }
});

// DELETE /tarefas/:id — Remove tarefa
router.delete("/:id", autenticar, async (req, res) => {
  const { id } = req.params;
  try {
    const [existe] = await db.query("SELECT id FROM tarefas WHERE id = ?", [id]);
    if (existe.length === 0) return res.status(404).json({ erro: "Tarefa não encontrada." });

    await db.query("DELETE FROM tarefas WHERE id = ?", [id]);
    res.json({ mensagem: "Tarefa deletada com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao deletar tarefa." });
  }
});

module.exports = router;
