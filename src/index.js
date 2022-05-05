import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import Joi from "joi";
import bcrypt from "bcrypt";

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
    db = mongoClient.db("MyWallet");
  })
  .catch((error) => console.log(error));

app.post("/cadastro", async (req, res) => {
  const { name, email, password, repassword } = req.body;

  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(30).required(),
    repassword: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
  });

  const { error } = schema.validate(
    { name, email, password, repassword },
    { abortEarly: false }
  );

  if (error) {
    console.log(chalk.yellow.bold(error));
    res.sendStatus(422);
    return;
  }

  try {
    const passwordEncrypted = bcrypt.hashSync(password, 10);
    if (await db.collection("users").findOne({ email })) {
      res.sendStatus(409);
      return;
    }
    await db.collection("users").insertOne({
      name,
      email,
      password: passwordEncrypted,
    });
    res.sendStatus(201);
  } catch (error) {
    console.log(chalk.bold.red(`${error} at /cadastro route`));
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.sendStatus(200);
      return;
    } else {
      res.sendStatus(422);
    }
  } catch (error) {
    console.log(chalk.bold.red(`${error} at /login route`));
  }
});

app.listen(
  PORT,
  console.log(
    chalk.bold.cyan(`
  Server is Running on port ${PORT}...
  `)
  )
);
