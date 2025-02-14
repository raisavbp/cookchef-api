import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // Adiciona os dados do utilizador ao request
    next(); // Continua para a próxima função
  } catch (error) {
    res.status(401).json({ message: "Token inválido." });
  }
};

export default authMiddleware;
