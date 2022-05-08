import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(json());
app.use(router);

app.listen(
  PORT,
  console.log(
    chalk.bold.cyan(`
  Server is Running on port ${PORT}...
  `)
  )
);
