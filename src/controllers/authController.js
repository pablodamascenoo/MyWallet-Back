import chalk from "chalk";
import Joi from "joi";
import db from "./../db.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function register(req, res) {
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
    res.sendStatus(500);
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(30).required(),
  });

  const { error } = schema.validate({ email, password }, { abortEarly: false });

  if (error) {
    res.sendStatus(422);
    return console.log(chalk.bold.yellow(error));
  }
  try {
    const user = await db.collection("users").findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();
      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
      });

      res.send(token).status(200);
      return;
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.log(chalk.bold.red(`${error} at /login route`));
    res.sendStatus(500);
  }
}
