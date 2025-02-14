import pool from "../db.js";

export default class AuthModel {
  // ✅ Guardar um refresh token no banco de dados
  static async saveRefreshToken(userId, token) {
    const query = `INSERT INTO RefreshTokens (user_id, token) VALUES (?, ?)`;
    const [result] = await pool.execute(query, [userId, token]);
    return result.insertId;
  }

  // ✅ Obter um refresh token do banco de dados
  static async getRefreshToken(token) {
    const query = `SELECT * FROM RefreshTokens WHERE token = ?`;
    const [rows] = await pool.execute(query, [token]);
    return rows.length ? rows[0] : null;
  }

  // ✅ Remover um refresh token do banco de dados (Logout)
  static async deleteRefreshToken(token) {
    const query = `DELETE FROM RefreshTokens WHERE token = ?`;
    const [result] = await pool.execute(query, [token]);
    return result.affectedRows > 0;
  }
}
