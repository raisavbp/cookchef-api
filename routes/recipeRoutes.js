import express from "express";
import RecipeModel from "../models/RecipeModel.js";
import authMiddleware from "../middleware/authMiddleware.js";
import axios from "axios";
import pool from "../db.js";

const router = express.Router();

// Rota para buscar receitas externas da TheMealDB
router.get("/external", async (req, res) => {
    try {
        const { nome } = req.query;

        if (!nome) {
            return res.status(400).json({ message: "O nome da receita é obrigatório." });
        }

        console.log(`🔍 Buscando receita externa: ${nome}`);

        // Fazendo a requisição para a API externa
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${nome}`);

        console.log("🌍 Resposta da API externa:", JSON.stringify(response.data, null, 2));

        // Se não houver resultado
        if (!response.data.meals || response.data.meals.length === 0) {
            console.log("⚠️ Nenhuma receita encontrada na API externa.");
            return res.status(404).json({ message: "Receita não encontrada na API externa." });
        }

        console.log("✅ Receita encontrada! Enviando resposta...");

        // Retornamos apenas as informações relevantes
        const receitasFormatadas = response.data.meals.map(meal => ({
            id: meal.idMeal,
            nome: meal.strMeal,
            categoria: meal.strCategory,
            area: meal.strArea,
            instrucoes: meal.strInstructions,
            imagem: meal.strMealThumb,
            ingredientes: Object.entries(meal)
                .filter(([key, value]) => key.startsWith("strIngredient") && value)
                .map(([_, value]) => value)
        }));

        res.json(receitasFormatadas);

    } catch (error) {
        console.error("❌ Erro ao buscar receitas externas:", error.message);
        res.status(500).json({ error: "Erro ao buscar receitas externas." });
    }
});

// Adicionar ou remover favorito
router.post("/favoritar", authMiddleware, async (req, res) => {
  try {
      const { recipe_id } = req.body;
      const user_id = req.user.userId; // Obtém o ID do usuário autenticado

      if (!recipe_id) {
          return res.status(400).json({ message: "O ID da receita é obrigatório." });
      }

      // Verifica se a receita já está favoritada
      const isFavorited = await RecipeModel.isFavorited(user_id, recipe_id);

      if (isFavorited) {
          // Se já estiver favoritada, remover dos favoritos
          await RecipeModel.removeFavorite(user_id, recipe_id);
          return res.json({ message: "Receita removida dos favoritos!" });
      } else {
          // Se não estiver favoritada, adicionar aos favoritos
          await RecipeModel.addFavorite(user_id, recipe_id);
          return res.json({ message: "Receita adicionada aos favoritos!" });
      }
  } catch (error) {
      console.error("Erro ao favoritar receita:", error);
      res.status(500).json({ error: "Erro interno no servidor" });
  }
});

router.get("/", async (req, res) => {
    try {
        let query = "SELECT * FROM receitas";
        const params = [];

        if (req.query.categoria) {
            query += " WHERE categoria_id = ?";
            params.push(req.query.categoria);
        }

        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar receitas" });
    }
});

// Rota para buscar receitas por categoria
router.get("/categoria/:categoria_id", async (req, res) => {
    const { categoria_id } = req.params;

    try {
        const query = "SELECT * FROM receitas WHERE categoria_id = ?";
        const [rows] = await pool.execute(query, [categoria_id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Nenhuma receita encontrada para esta categoria." });
        }

        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar receitas:", error);
        res.status(500).json({ message: "Erro no servidor ao buscar receitas." });
    }
});


export default router;
