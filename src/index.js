import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";

import { login, register } from "./controllers/authController.js";
import { getBalance, postValue } from "./controllers/balanceController.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(json());

app.post("/cadastro", register);

app.post("/login", login);

app.get("/balance", getBalance);

app.post("/balance", postValue);

app.listen(
  PORT,
  console.log(
    chalk.bold.cyan(`
  Server is Running on port ${PORT}...
  `)
  )
);
