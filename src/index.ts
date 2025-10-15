import express from "express";
import prisma from "./prisma/client";
import authRoutes from "./routes/auth.routes";

const app = express();

// Middleware global para parsear JSON
app.use(express.json());

// Rutas principales
app.use("/api", authRoutes);

// Ruta base de prueba
app.get("/", (req, res) => {
  res.send("🚀 Servidor Deyfus en marcha y estructurado correctamente");
});

// Verificar conexión a la base de datos
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Conectado a la base de datos PostgreSQL");
  } catch (err) {
    console.error("❌ Error de conexión a la base de datos:", err);
    process.exit(1);
  }
})();

// Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
