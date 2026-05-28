const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// ─── Rotas ────────────────────────────────────
app.use("/auth", require("./routes/auth"));
app.use("/usuarios", require("./routes/usuarios"));
app.use("/projetos", require("./routes/projetos"));
app.use("/tarefas", require("./routes/tarefas"));

app.get("/", (req, res) => {
  res.json({ mensagem: "API AgilePro funcionando! 🚀" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
