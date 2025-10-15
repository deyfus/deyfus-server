import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecreto";

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: "1d" });
};
