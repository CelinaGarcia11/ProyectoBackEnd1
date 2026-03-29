import jwt from "jsonwebtoken";

const SECRET = "coderSecret"; // después se puede mejorar

export const generateToken = (user) => {
  return jwt.sign({ user }, SECRET, { expiresIn: "1h" });
};