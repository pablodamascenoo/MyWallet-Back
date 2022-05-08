import db from "./../db.js";
import chalk from "chalk";
import dayjs from "dayjs";
import Joi from "joi";

export async function getBalance(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!session) return res.sendStatus(401);

    const user = await db.collection("users").findOne({
      _id: session.userId,
    });

    if (!user) return res.sendStatus(401);

    let balance = await db
      .collection("balance")
      .find({
        userId: user._id,
      })
      .toArray();

    delete balance.userId;

    res.send(balance).status(200);
  } catch (error) {
    console.log(chalk.bold.red(`${error} at get /balance`));
  }
}

export async function postValue(req, res) {
  const { description, type, value } = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  const schema = Joi.object({
    description: Joi.string().min(3).max(25).required(),
    type: Joi.string().valid("income", "outgoing").required(),
    value: Joi.string()
      .pattern(/^\d+\,\d{2}$/)
      .required(),
  });

  const { error } = schema.validate(
    { description, type, value },
    { abortEarly: false }
  );

  if (error) {
    console.log(chalk.bold.yellow(error));
    return res.sendStatus(422);
  }

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!session) return res.sendStatus(401);

    const user = await db.collection("users").findOne({
      _id: session.userId,
    });

    if (!user) return res.sendStatus(401);

    await db.collection("balance").insertOne({
      userId: user._id,
      description,
      type,
      value,
      date: dayjs().format("DD/MM"),
    });

    return res.sendStatus(201);
  } catch (error) {
    console.log(chalk.bold.red(`${error} at post /balance`));
  }
}
