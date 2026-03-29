import { Router } from "express";
import User from "../models/User.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import passport from "passport";


const router = Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ error: "Usuario ya existe" });

  const user = await User.create({
    first_name,
    last_name,
    email,
    age,
    password: createHash(password)
  });

  res.status(201).json({ message: "Usuario creado", user });
});

//  LOGIN 
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Usuario no existe" });

  if (!isValidPassword(user, password)) {
    return res.status(400).json({ error: "Contraseña incorrecta" });
  }

  const token = generateToken(user);

  res.json({ message: "Login exitoso", token });
});

import { auth } from "../utils/auth.js";


router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

export default router;