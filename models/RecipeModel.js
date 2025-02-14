import pool from "../db.js";

export default class RecipeModel {
  static async createRecipe(nome, autor_id, descricao, dificuldade, categoria_id, tempo, custo) {
    const query = `INSERT INTO Receitas (nome, autor_id, descricao, dificuldade, categoria_id, tempo, custo) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [nome, autor_id, descricao, dificuldade, categoria_id, tempo, custo]);
    return result.insertId;
  }

  static async getAllRecipes() {
    const query = `SELECT * FROM Receitas`;
    const [rows] = await pool.execute(query);
    return rows;
  }

  static async getRecipeById(id) {
    const query = `SELECT * FROM Receitas WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }
}
