import { generateToken } from "../utils/jwt.js";
import { isValidPassword, createHash } from "../utils/bcrypt.js";
import UserDAO from "../dao/UserDAO.js";
import UserRepository from "../repositories/UserRepository.js";
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/UserDTO.js";

const router = Router();
const userRepository = new UserRepository(new UserDAO());

// ------------------- REGISTER -------------------
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  const exist = await userRepository.getUserBy({ email });
  if (exist) return res.status(400).json({ error: "Usuario ya existe" });

  const user = await userRepository.createUser({
    first_name,
    last_name,
    email,
    age,
    password: createHash(password)
  });

  res.status(201).json({ message: "Usuario creado", user });
});

// ------------------- LOGIN -------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userRepository.getUserBy({ email });
  if (!user) return res.status(400).json({ error: "Usuario no existe" });

  if (!isValidPassword(user, password)) {
    return res.status(400).json({ error: "Contraseña incorrecta" });
  }

  const token = generateToken(user);
  res.json({ message: "Login exitoso", token });
});

// ------------------- CURRENT USER -------------------
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = new UserDTO(req.user);
    res.json({ user });
  }
);

// ------------------- FORGOT PASSWORD -------------------
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await userRepository.getUserBy({ email });
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  const token = generateToken(user);

  // Simulación de envío de email
  const link = `http://localhost:8080/api/sessions/reset-password?token=${token}`;

  res.json({
    message: "Link de recuperación generado",
    link
  });
});

// ------------------- RESET PASSWORD -------------------
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, "coderSecret");
    const user = await userRepository.getUserBy({ email: decoded.user.email });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Evitar misma contraseña
    if (isValidPassword(user, newPassword)) {
      return res.status(400).json({ error: "No podés usar la misma contraseña" });
    }

    const hashedPassword = createHash(newPassword);
    await userRepository.updateUser(user._id, { password: hashedPassword });

    res.json({ message: "Contraseña actualizada" });

  } catch (error) {
    res.status(400).json({ error: "Token inválido o expirado" });
  }
});

export default router;