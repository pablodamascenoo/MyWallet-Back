import express from "express";
import { login, register } from "../controllers/authController.js";
import {
  loginSchema,
  registerSchema,
} from "../middlewares/schemasMiddleware.js";

const authRouter = express.Router();

authRouter.post("/cadastro", registerSchema, register);
authRouter.post("/login", loginSchema, login);

export default authRouter;
