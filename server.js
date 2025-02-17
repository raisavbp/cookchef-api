import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

import pool from "./db.js"; // Importa a conexão com o banco de dados
import session from "express-session";
import passport from "./config/passport.js";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";


dotenv.config();

const app = express();

// Configuração de middlewares (A ORDEM IMPORTA)
app.use(cors());
app.use(express.json());

// ⚠️ A sessão DEVE vir antes das rotas e do Passport!
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Inicializar Passport e sessão 
app.use(passport.initialize());
app.use(passport.session());

// Definir as rotas depois do Passport
app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);
app.use("/auth", authRoutes);

//Favoritos
app.use("/favorites", favoriteRoutes);

//coleçoes
app.use("/collections", collectionRoutes);


// Testar conexão ao banco de dados
async function testDBConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexão ao MySQL bem-sucedida!");
    connection.release();
  } catch (error) {
    console.error("❌ Erro ao conectar ao MySQL:", error.message);
  }
}
testDBConnection();

// Rota de teste
app.get("/", (req, res) => {
  res.send("Servidor está a funcionar!");
});

/*async function testarAPIExterna() {
  try {
      console.log("🔍 Testando conexão com TheMealDB...");

      const response = await axios.get("https://www.themealdb.com/api/json/v1/1/search.php?s=lasagna");

      console.log("📥 Resposta da API externa:", response.data);
  } catch (error) {
      console.error("❌ Erro ao chamar API externa:", error.message);
  }
}

// Chamar a função de teste quando o servidor iniciar
testarAPIExterna();
*/


// Definição da porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr na porta ${PORT}`);
});


