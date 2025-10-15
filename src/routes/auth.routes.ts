import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";

const router = Router();

// Endpoints de autenticación
router.post("/users", registerUser); // POST /api/users
router.post("/login", loginUser);    // POST /api/login

export default router;