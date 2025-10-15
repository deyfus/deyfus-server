import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";
import { registerSchema, loginSchema } from "../validations/auth.schema";

const JWT_SECRET = process.env.JWT_SECRET || "clave_por_defecto_insegura";

// --- REGISTRO DE USUARIO ---
export const registerUser = async (data: any) => {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message);
  }

  const { name, email, password } = parsed.data;

  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("El usuario ya existe");
  }

  // Encriptar contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear usuario
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

// --- LOGIN DE USUARIO ---
export const loginUser = async (data: any) => {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message);
  }

  const { email, password } = parsed.data;

  // Buscar usuario
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Comparar contraseñas
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Credenciales incorrectas");
  }

  // Generar token JWT
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    message: "Inicio de sesión exitoso",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
