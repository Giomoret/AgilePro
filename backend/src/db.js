const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "agilepro",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
});

pool
    .getConnection()
    .then((conn) => {
        console.log("✅ Conectado ao MySQL com sucesso!");
        conn.release();
    })
    .catch((err) => {
        console.error("❌ Erro ao conectar ao MySQL:", err.message);
    });

module.exports = pool;