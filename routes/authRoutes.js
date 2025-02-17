import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

dotenv.config();

const router = express.Router();

// Configurar Passport com Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Middleware de sessão para Passport
router.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());

// Iniciar autenticação com Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback após autenticação
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    const token = jwt.sign(
        { id: req.user.id, nome: req.user.displayName, email: req.user.emails[0].value },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.redirect(`http://localhost:5173/dashboard?token=${token}&nome=${req.user.displayName}`);
});

// Rota de logout
router.post("/logout", (req, res) => {
    req.logout(() => {
        req.session.destroy();
        res.json({ message: "Logout realizado com sucesso!" });
    });
});

export default router;
