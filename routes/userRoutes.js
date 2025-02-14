import express from "express";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Rota de login com JWT
router.post("/login", async (req, res) => {
    try {
      const { email, senha } = req.body;
  
      // Buscar o utilizador pelo email
      const user = await UserModel.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "Utilizador não encontrado" });
      }
  
      // Comparar a senha fornecida com a senha encriptada no banco de dados
      const passwordMatch = await bcrypt.compare(senha, user.senha);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Senha incorreta" });
      }
  
      // Gerar um token JWT
      const token = jwt.sign(
        { userId: user.id, nome: user.nome },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // O token expira em 1 hora
      );
  
      res.json({ message: "Login bem-sucedido!", token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Criar um novo utilizador
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const userId = await UserModel.createUser(nome, email, senha);
    res.status(201).json({ message: "Utilizador criado!", userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar utilizador por email
router.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.getUserByEmail(email);
    if (!user) return res.status(404).json({ message: "Utilizador não encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
