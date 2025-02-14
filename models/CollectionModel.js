import pool from "../db.js";

export default class CollectionModel {
  // ✅ Criar uma nova coleção
  static async createCollection(userId, nome) {
    const query = `INSERT INTO Colecoes (user_id, nome) VALUES (?, ?)`;
    const [result] = await pool.execute(query, [userId, nome]);
    return result.insertId;
  }

  // ✅ Listar todas as coleções do utilizador
  static async getUserCollections(userId) {
    const query = `SELECT id, nome FROM Colecoes WHERE user_id = ?`;
    const [rows] = await pool.execute(query, [userId]);
    return rows;
  }

  // ✅ Adicionar uma receita a uma coleção
  static async addRecipeToCollection(colecaoId, recipeId) {
    const query = `INSERT INTO Colecao_Receitas (colecao_id, recipe_id) VALUES (?, ?)`;
    const [result] = await pool.execute(query, [colecaoId, recipeId]);
    return result.insertId;
  }

  // ✅ Listar todas as receitas dentro de uma coleção
  static async getCollectionRecipes(colecaoId) {
    const query = `
      SELECT R.id, R.nome, R.descricao, R.dificuldade, R.tempo, R.custo 
      FROM Colecao_Receitas CR
      JOIN Receitas R ON CR.recipe_id = R.id
      WHERE CR.colecao_id = ?
    `;
    const [rows] = await pool.execute(query, [colecaoId]);
    return rows;
  }

  // ✅ Remover uma receita de uma coleção
  static async removeRecipeFromCollection(colecaoId, recipeId) {
    const query = `DELETE FROM Colecao_Receitas WHERE colecao_id = ? AND recipe_id = ?`;
    const [result] = await pool.execute(query, [colecaoId, recipeId]);
    return result.affectedRows > 0;
  }

  // ✅ Excluir uma coleção
  static async deleteCollection(colecaoId) {
    const query = `DELETE FROM Colecoes WHERE id = ?`;
    const [result] = await pool.execute(query, [colecaoId]);
    return result.affectedRows > 0;
  }
}
