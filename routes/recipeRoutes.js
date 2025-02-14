import express from "express";
import RecipeModel from "../models/RecipeModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Criar uma nova receita
router.post("/create", async (req, res) => {
  try {
    const { nome, autor_id, descricao, dificuldade, categoria_id, tempo, custo } = req.body;
    const recipeId = await RecipeModel.createRecipe(nome, autor_id, descricao, dificuldade, categoria_id, tempo, custo);
    res.status(201).json({ message: "Receita criada!", recipeId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar todas as receitas (APENAS PARA UTILIZADORES AUTENTICADOS)
router.get("/", authMiddleware, async (req, res) => {
    try {
      const recipes = await RecipeModel.getAllRecipes();
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Buscar uma receita pelo ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await RecipeModel.getRecipeById(id);
    if (!recipe) return res.status(404).json({ message: "Receita não encontrada" });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
