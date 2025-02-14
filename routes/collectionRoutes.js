import express from "express";
import CollectionModel from "../models/CollectionModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Criar uma nova coleção (APENAS PARA UTILIZADORES AUTENTICADOS)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { nome } = req.body;
    const userId = req.user.userId;

    if (!nome) {
      return res.status(400).json({ message: "O nome da coleção é obrigatório." });
    }

    const collectionId = await CollectionModel.createCollection(userId, nome);
    res.json({ message: "Coleção criada com sucesso!", collectionId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Listar todas as coleções do utilizador
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const collections = await CollectionModel.getUserCollections(userId);
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Adicionar uma receita a uma coleção
router.post("/:id/add-recipe", authMiddleware, async (req, res) => {
  try {
    const { recipeId } = req.body;
    const colecaoId = req.params.id;

    if (!recipeId) {
      return res.status(400).json({ message: "O ID da receita é obrigatório." });
    }

    const addRecipe = await CollectionModel.addRecipeToCollection(colecaoId, recipeId);
    res.json({ message: "Receita adicionada à coleção!", addRecipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Listar todas as receitas dentro de uma coleção
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const colecaoId = req.params.id;
    const recipes = await CollectionModel.getCollectionRecipes(colecaoId);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Remover uma receita de uma coleção
router.delete("/:id/remove-recipe", authMiddleware, async (req, res) => {
  try {
    const { recipeId } = req.body;
    const colecaoId = req.params.id;

    if (!recipeId) {
      return res.status(400).json({ message: "O ID da receita é obrigatório." });
    }

    const success = await CollectionModel.removeRecipeFromCollection(colecaoId, recipeId);
    if (!success) {
      return res.status(404).json({ message: "Receita não encontrada na coleção." });
    }

    res.json({ message: "Receita removida da coleção!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Excluir uma coleção inteira
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const colecaoId = req.params.id;

    const success = await CollectionModel.deleteCollection(colecaoId);
    if (!success) {
      return res.status(404).json({ message: "Coleção não encontrada." });
    }

    res.json({ message: "Coleção excluída com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
