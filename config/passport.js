import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import dotenv from "dotenv";
import UserModel from "../models/UserModel.js";

dotenv.config();

// Configurar a estratégia do Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        // Verificar se o utilizador já existe no banco de dados
        let user = await UserModel.getUserByEmail(profile.email);

        if (!user) {
          // Criar um novo utilizador no banco de dados se ele não existir
          const userId = await UserModel.createUser(profile.displayName, profile.email, "google-auth");
          user = await UserModel.getUserById(userId);
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialização do utilizador na sessão
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
