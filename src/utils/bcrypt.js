import bcrypt from "bcrypt";

// encriptar contraseña
export const createHash = password => 
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// comparar contraseña
export const isValidPassword = (user, password) => 
  bcrypt.compareSync(password, user.password);