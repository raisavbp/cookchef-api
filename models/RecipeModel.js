import pool from "../db.js";

export default class RecipeModel {
  // Criar uma nova receita
  static async createRecipe(nome, autor_id, descricao, dificuldade, categoria_id, tempo, custo) {
    const query = `INSERT INTO Receitas (nome, autor_id, descricao, dificuldade, categoria_id, tempo, custo) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [nome, autor_id, descricao, dificuldade, categoria_id, tempo, custo]);
    return result.insertId;
  }

  // Buscar todas as receitas
  static async getAllRecipes() {
    const query = `SELECT * FROM Receitas`;
    const [rows] = await pool.execute(query);
    return rows;
  }

  // Buscar uma receita pelo ID
  static async getRecipeById(id) {
    const query = `SELECT * FROM Receitas WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  // ✅ Verifica se uma receita já está favoritada pelo usuário
  static async isFavorited(user_id, recipe_id) {
    const query = "SELECT * FROM Favoritos WHERE user_id = ? AND recipe_id = ?";
    const [rows] = await pool.execute(query, [user_id, recipe_id]);
    return rows.length > 0;
  }

  // ✅ Adiciona uma receita aos favoritos do usuário
  static async addFavorite(user_id, recipe_id) {
    const query = "INSERT INTO Favoritos (user_id, recipe_id) VALUES (?, ?)";
    await pool.execute(query, [user_id, recipe_id]);
  }

  // ✅ Remove uma receita dos favoritos do usuário
  static async removeFavorite(user_id, recipe_id) {
    const query = "DELETE FROM Favoritos WHERE user_id = ? AND recipe_id = ?";
    await pool.execute(query, [user_id, recipe_id]);
  }
}
