import express from "express";
import { login, register } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/cadastro", register);
authRouter.post("/login", login);

export default authRouter;
