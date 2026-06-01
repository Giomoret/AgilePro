const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db");
const { autenticar } = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../../uploads/avatars");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.params.id}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Apenas imagens são permitidas."));
  },
});

// GET /usuarios
router.get("/", autenticar, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nome, email, cargo, cargo_display, avatar, criado_em FROM usuarios ORDER BY criado_em DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar usuários." });
  }
});

// GET /usuarios/:id
router.get("/:id", autenticar, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT id, nome, email, cargo, cargo_display, avatar, criado_em FROM usuarios WHERE id = ?",
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ erro: "Usuário não encontrado." });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar usuário." });
  }
});

// POST /usuarios
router.post("/", async (req, res) => {
  const { nome, email, senha, cargo } = req.body;
  if (!nome || !email || !senha)
    return res.status(400).json({ erro: "Nome, email e senha são obrigatórios." });

  try {
    const [existe] = await db.query("SELECT id FROM usuarios WHERE email = ?", [email]);
    if (existe.length > 0) return res.status(409).json({ erro: "Email já cadastrado." });

    const senhaHash = await bcrypt.hash(senha, 10);

    // cargo_display = o cargo como veio do frontend (ex: 'Scrum Master', 'Product Owner')
    // cargo = 'admin' ou 'membro' para controle de permissão
    const cargoPermissao = ['admin', 'Scrum Master', 'Product Owner'].includes(cargo) ? 'admin' : 'membro';
    const cargoDisplay = cargo || 'Dev / Membro';

    const [result] = await db.query(
      "INSERT INTO usuarios (nome, email, senha, cargo, cargo_display) VALUES (?, ?, ?, ?, ?)",
      [nome, email, senhaHash, cargoPermissao, cargoDisplay]
    );
    res.status(201).json({ mensagem: "Usuário criado com sucesso!", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar usuário." });
  }
});

// PUT /usuarios/:id
router.put("/:id", autenticar, async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, cargo } = req.body;

  try {
    const [existe] = await db.query("SELECT id FROM usuarios WHERE id = ?", [id]);
    if (existe.length === 0) return res.status(404).json({ erro: "Usuário não encontrado." });

    const campos = [];
    const valores = [];

    if (nome) { campos.push("nome = ?"); valores.push(nome); }
    if (email) { campos.push("email = ?"); valores.push(email); }
    if (cargo) {
      // Salva permissão (admin/membro) e display separados
      const cargoPermissao = ['admin', 'Scrum Master', 'Product Owner'].includes(cargo) ? 'admin' : 'membro';
      campos.push("cargo = ?"); valores.push(cargoPermissao);
      campos.push("cargo_display = ?"); valores.push(cargo);
    }
    if (senha) {
      const senhaHash = await bcrypt.hash(senha, 10);
      campos.push("senha = ?");
      valores.push(senhaHash);
    }

    if (campos.length === 0) return res.status(400).json({ erro: "Nenhum campo para atualizar." });

    valores.push(id);
    await db.query(`UPDATE usuarios SET ${campos.join(", ")} WHERE id = ?`, valores);
    res.json({ mensagem: "Usuário atualizado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar usuário." });
  }
});

// POST /usuarios/:id/avatar
router.post("/:id/avatar", autenticar, upload.single("avatar"), async (req, res) => {
  const { id } = req.params;
  if (!req.file) return res.status(400).json({ erro: "Nenhuma imagem enviada." });

  try {
    const [rows] = await db.query("SELECT avatar FROM usuarios WHERE id = ?", [id]);
    if (rows[0]?.avatar) {
      const oldPath = path.join(__dirname, "../../", rows[0].avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    await db.query("UPDATE usuarios SET avatar = ? WHERE id = ?", [avatarPath, id]);
    res.json({ mensagem: "Avatar atualizado com sucesso!", avatar: avatarPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao salvar avatar." });
  }
});

// DELETE /usuarios/:id
router.delete("/:id", autenticar, async (req, res) => {
  const { id } = req.params;
  if (req.usuario.id === parseInt(id))
    return res.status(400).json({ erro: "Você não pode deletar sua própria conta." });

  try {
    const [existe] = await db.query("SELECT id FROM usuarios WHERE id = ?", [id]);
    if (existe.length === 0) return res.status(404).json({ erro: "Usuário não encontrado." });

    await db.query("DELETE FROM usuarios WHERE id = ?", [id]);
    res.json({ mensagem: "Usuário deletado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao deletar usuário." });
  }
});

module.exports = router;