import 'dotenv/config';
import app from "./src/app.js";
import initDb from "./src/config/initDb.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Inicializa la base de datos si no existe
    await initDb();

    // Levanta el servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor alojado en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      "No se pudo iniciar el servidor debido a un error en la base de datos.",
    );
    process.exit(1);
  }
}

startServer();
