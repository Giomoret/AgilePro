const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db");
const { autenticar } = require("../middlewares/auth");

// ─────────────────────────────────────────────
// GET /usuarios — Lista todos os usuários
// ─────────────────────────────────────────────
router.get("/", autenticar, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nome, email, cargo, criado_em FROM usuarios ORDER BY criado_em DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar usuários." });
  }
});

// ─────────────────────────────────────────────
// GET /usuarios/:id — Busca um usuário por ID
// ─────────────────────────────────────────────
router.get("/:id", autenticar, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT id, nome, email, cargo, criado_em FROM usuarios WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar usuário." });
  }
});

// ─────────────────────────────────────────────
// POST /usuarios — Cria um novo usuário
// ─────────────────────────────────────────────
router.post("/", async (req, res) => {
  const { nome, email, senha, cargo } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ erro: "Nome, email e senha são obrigatórios." });
  }

  try {
    // Verifica se email já existe
    const [existe] = await db.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );
    if (existe.length > 0) {
      return res.status(409).json({ erro: "Email já cadastrado." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const [result] = await db.query(
      "INSERT INTO usuarios (nome, email, senha, cargo) VALUES (?, ?, ?, ?)",
      [nome, email, senhaHash, cargo || "membro"]
    );

    res.status(201).json({
      mensagem: "Usuário criado com sucesso!",
      id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar usuário." });
  }
});

// ─────────────────────────────────────────────
// PUT /usuarios/:id — Atualiza um usuário
// ─────────────────────────────────────────────
router.put("/:id", autenticar, async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, cargo } = req.body;

  if (!nome && !email && !senha && !cargo) {
    return res
      .status(400)
      .json({ erro: "Informe ao menos um campo para atualizar." });
  }

  try {
    const [existe] = await db.query(
      "SELECT id FROM usuarios WHERE id = ?",
      [id]
    );
    if (existe.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    // Monta a query dinamicamente com os campos enviados
    const campos = [];
    const valores = [];

    if (nome) { campos.push("nome = ?"); valores.push(nome); }
    if (email) { campos.push("email = ?"); valores.push(email); }
    if (cargo) { campos.push("cargo = ?"); valores.push(cargo); }
    if (senha) {
      const senhaHash = await bcrypt.hash(senha, 10);
      campos.push("senha = ?");
      valores.push(senhaHash);
    }

    valores.push(id);

    await db.query(
      `UPDATE usuarios SET ${campos.join(", ")} WHERE id = ?`,
      valores
    );

    res.json({ mensagem: "Usuário atualizado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar usuário." });
  }
});

// ─────────────────────────────────────────────
// DELETE /usuarios/:id — Remove um usuário
// ─────────────────────────────────────────────
router.delete("/:id", autenticar, async (req, res) => {
  const { id } = req.params;

  // Impede deletar o próprio usuário logado
  if (req.usuario.id === parseInt(id)) {
    return res
      .status(400)
      .json({ erro: "Você não pode deletar sua própria conta." });
  }

  try {
    const [existe] = await db.query(
      "SELECT id FROM usuarios WHERE id = ?",
      [id]
    );
    if (existe.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    await db.query("DELETE FROM usuarios WHERE id = ?", [id]);

    res.json({ mensagem: "Usuário deletado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao deletar usuário." });
  }
});

module.exports = router;
