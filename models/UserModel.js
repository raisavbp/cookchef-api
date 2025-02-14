import pool from "../db.js";
import bcrypt from "bcrypt";

export default class UserModel {
  static async createUser(nome, email, senha) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    const query = `INSERT INTO Utilizadores (nome, email, senha) VALUES (?, ?, ?)`;
    const [result] = await pool.execute(query, [nome, email, hashedPassword]);
    return result.insertId;
  }

  static async getUserByEmail(email) {
    const query = `SELECT * FROM Utilizadores WHERE email = ?`;
    const [rows] = await pool.execute(query, [email]);
    return rows[0];
  }

  static async getUserById(id) {
    const query = `SELECT * FROM Utilizadores WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }
}
