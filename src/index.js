import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import Joi from "joi";

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(cors());
app.use(json());

let db;
const mongoClient = new MongoClient(MONGO_URI);

mongoClient
  .connect()
  .then(() => {
    console.log("connected");
  })
  .catch((error) => console.log(error));

app.listen(
  PORT,
  console.log(
    chalk.bold.cyan(`
  Server is Running on port ${PORT}...
  `)
  )
);
