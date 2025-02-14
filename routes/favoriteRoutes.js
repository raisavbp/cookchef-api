import express from "express";
import FavoriteModel from "../models/FavoriteModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Adicionar uma receita aos favoritos (APENAS PARA UTILIZADORES AUTENTICADOS)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.userId;

    if (!recipeId) {
      return res.status(400).json({ message: "O ID da receita é obrigatório." });
    }

    const favoriteId = await FavoriteModel.addFavorite(userId, recipeId);
    res.json({ message: "Receita adicionada aos favoritos!", favoriteId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Remover uma receita dos favoritos
router.delete("/", authMiddleware, async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.userId;

    if (!recipeId) {
      return res.status(400).json({ message: "O ID da receita é obrigatório." });
    }

    const success = await FavoriteModel.removeFavorite(userId, recipeId);
    if (!success) {
      return res.status(404).json({ message: "Receita não encontrada nos favoritos." });
    }

    res.json({ message: "Receita removida dos favoritos!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Listar todas as receitas favoritas do utilizador autenticado
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const favorites = await FavoriteModel.getUserFavorites(userId);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
