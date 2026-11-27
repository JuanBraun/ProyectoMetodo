require("dotenv").config();
const app = require("./src/app");
const pool = require("./src/config/database");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Verifica que la base de datos existente esté disponible sin crear ni reiniciar nada
    const connection = await pool.getConnection();
    connection.release();
    console.log("Conectado a la base de datos existente.");

    // Levanta el servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor alojado en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      "No se pudo conectar a la base de datos. Asegurate de haber ejecutado 'npm run init-db' previamente:",
      error.message
    );
    process.exit(1);
  }
}

startServer();