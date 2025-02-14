import pool from "../db.js";

export default class FavoriteModel {
  // Adicionar uma receita aos favoritos
  static async addFavorite(userId, recipeId) {
    const query = `INSERT INTO Favoritos (user_id, recipe_id) VALUES (?, ?)`;
    const [result] = await pool.execute(query, [userId, recipeId]);
    return result.insertId;
  }

  // Remover uma receita dos favoritos
  static async removeFavorite(userId, recipeId) {
    const query = `DELETE FROM Favoritos WHERE user_id = ? AND recipe_id = ?`;
    const [result] = await pool.execute(query, [userId, recipeId]);
    return result.affectedRows > 0;
  }

  // Listar todas as receitas favoritas do utilizador
  static async getUserFavorites(userId) {
    const query = `
      SELECT R.id, R.nome, R.descricao, R.dificuldade, R.tempo, R.custo
      FROM Favoritos F
      JOIN Receitas R ON F.recipe_id = R.id
      WHERE F.user_id = ?
    `;
    const [rows] = await pool.execute(query, [userId]);
    return rows;
  }
}
