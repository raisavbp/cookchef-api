import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authMiddleware from "../middleware/authMiddleware.js";
import AuthModel from "../models/AuthModel.js";

dotenv.config();

const router = express.Router();

// Rota para iniciar o login com Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Rota de callback após autenticação bem-sucedida
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      // Gerar um token JWT
      const token = jwt.sign(
        { userId: req.user.id, nome: req.user.nome, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      // Redirecionar para o frontend com o token na URL
      res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    }
  );
  
// ✅ Rota para fazer logout e invalidar o refresh token
router.post("/logout", authMiddleware, async (req, res) => {
    try {
      const { token } = req.body; // Recebe o refresh token no body
  
      if (!token) {
        return res.status(400).json({ message: "O refresh token é obrigatório." });
      }
  
      // Apaga o token do banco de dados
      const deleted = await AuthModel.deleteRefreshToken(token);
      if (!deleted) {
        return res.status(404).json({ message: "Refresh token não encontrado." });
      }
  
      res.json({ message: "Logout realizado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // ✅ Rota para obter um novo token JWT usando um refresh token
  router.post("/refresh-token", async (req, res) => {
    try {
      const { token } = req.body;
  
      if (!token) {
        return res.status(400).json({ message: "O refresh token é obrigatório." });
      }
  
      // Verifica se o refresh token está armazenado
      const storedToken = await AuthModel.getRefreshToken(token);
      if (!storedToken) {
        return res.status(403).json({ message: "Refresh token inválido ou expirado." });
      }
  
      // Decodifica o refresh token para obter o userId
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Refresh token inválido." });
        }
  
        const newToken = jwt.sign(
          { userId: decoded.userId, nome: decoded.nome, email: decoded.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
  
        res.json({ token: newToken });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

export default router;
