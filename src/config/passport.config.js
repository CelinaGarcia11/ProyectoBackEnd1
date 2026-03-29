import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import User from "../models/User.js";
import { isValidPassword } from "../utils/bcrypt.js";

const LocalStrategy = local.Strategy;
const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const SECRET = "coderSecret";

export const initializePassport = () => {

  //  LOGIN (local)
  passport.use("login", new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) return done(null, false);

        if (!isValidPassword(user, password)) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  //  JWT
  passport.use("jwt", new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET
    },
    async (jwt_payload, done) => {
      try {
        return done(null, jwt_payload.user);
      } catch (error) {
        return done(error);
      }
    }
  ));
};