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
    res.sendStatus(500);
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
      res.sendStatus(401);
    }
  } catch (error) {
    console.log(chalk.bold.red(`${error} at /login route`));
    res.sendStatus(500);
  }
}
