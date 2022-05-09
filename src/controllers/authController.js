import chalk from "chalk";
import Joi from "joi";
import db from "./../db.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function register(req, res) {
  const { name, email, password } = req.body;

  try {
    const passwordEncrypted = bcrypt.hashSync(password, 10);
    if (await db.collection("users").findOne({ email })) {
      res.send("email já cadastrado").status(409);
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
    res.send("Erro interno no Servidor").status(500);
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();
      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
      });

      res.send({ token, name: user.name }).status(200);
      return;
    } else {
      res.send("email e/ou senha incorretos").status(401);
      return;
    }
  } catch (error) {
    console.log(chalk.bold.red(`${error} at /login route`));
    res.send("Erro interno no servidor").status(500);
  }
}
