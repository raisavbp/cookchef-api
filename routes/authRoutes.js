import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
  

// Rota de logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logout realizado com sucesso!" });
  });
});

export default router;
