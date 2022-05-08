import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";

import authRouter from "./routes/authRouter.js";
import balanceRouter from "./routes/balanceRouter.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(json());

const router = express.Router();

router.use(authRouter);
router.use(balanceRouter);

app.listen(
  PORT,
  console.log(
    chalk.bold.cyan(`
  Server is Running on port ${PORT}...
  `)
  )
);

export default router;
