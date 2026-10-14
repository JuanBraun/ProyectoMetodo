const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function initDb() {
  // 1. Conexión inicial sin especificar base de datos para poder ejecutar 'CREATE DATABASE'
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true, // Permite ejecutar todo el archivo .sql de una sola vez
  });

  try {
    // 2. Leer el archivo schema.sql
    const schemaPath = path.join(__dirname, "../../database/schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");

    // 3. Ejecutar las sentencias del script
    await connection.query(sql);
    console.log("Base de datos y tablas verificadas/creadas correctamente.");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

module.exports = initDb;
