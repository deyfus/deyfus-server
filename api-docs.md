🧭 API Deyfus – Módulo de Autenticación

Este documento describe los endpoints principales de autenticación del sistema de inventario Deyfus, incluyendo formato de peticiones, respuestas y posibles errores.

📁 Base URL
http://localhost:3000/api

🧍‍♂️ POST /users

Registrar nuevo usuario

Descripción

Crea un nuevo usuario en el sistema.
Valida los datos con Zod, cifra la contraseña con bcrypt y guarda el usuario en la base de datos PostgreSQL.

Request Body
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}

Validaciones

name: obligatorio, mínimo 1 carácter.

email: obligatorio, formato válido.

password: mínimo 6 caracteres.

Ejemplo de respuesta (201 Created)
{
  "message": "Usuario registrado correctamente",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "createdAt": "2025-10-13T12:30:00.000Z"
  }
}

Posibles errores
Código	Descripción
400	"El nombre es obligatorio"
400	"Correo inválido"
400	"La contraseña debe tener al menos 6 caracteres"
400	"Ya existe un usuario con este email"
500	"Error interno del servidor"
🔐 POST /login

Iniciar sesión

Descripción

Autentica un usuario existente.
Verifica el correo y la contraseña, y si son válidos, genera un token JWT que contiene el id y email del usuario.

Request Body
{
  "email": "juan@example.com",
  "password": "123456"
}

Ejemplo de respuesta (200 OK)
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}

Posibles errores
Código	Descripción
400	"El email es obligatorio"
400	"Correo inválido"
400	"Contraseña es obligatoria"
404	"Usuario no encontrado"
401	"Contraseña incorrecta"
500	"Error interno del servidor"
🔏 Autenticación con JWT

Las rutas protegidas requerirán enviar el token generado en el header:

Authorization: Bearer <token>


El token se firma con la variable de entorno JWT_SECRET y tiene una duración de 7 días.

⚙️ Errores comunes del servidor
Tipo	Mensaje	Solución
PrismaError	"Error de conexión a la base de datos"	Verifica DATABASE_URL en .env
JWTError	"Token inválido o expirado"	Solicita nuevo inicio de sesión
ValidationError	"Correo inválido" o "Contraseña corta"	Corrige datos de entrada
🧩 Resumen técnico
Componente	Librería / Tecnología
Servidor	Express.js
ORM	Prisma
Base de datos	PostgreSQL
Validación	Zod
Cifrado	bcrypt
Tokens	JWT