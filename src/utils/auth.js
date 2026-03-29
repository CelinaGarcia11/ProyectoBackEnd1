import jwt from "jsonwebtoken";

const SECRET = "coderSecret";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido" });
  }
};