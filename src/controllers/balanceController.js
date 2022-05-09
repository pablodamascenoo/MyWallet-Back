import db from "./../db.js";
import chalk from "chalk";
import dayjs from "dayjs";

export async function getBalance(req, res) {
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");

  try {
    const session = await db.collection("sessions").findOne({ token });

    const user = await db.collection("users").findOne({
      _id: session.userId,
    });

    const balance = await db
      .collection("balance")
      .find({
        userId: user._id,
      })
      .toArray();

    balance.forEach((value) => delete value.userId);

    res.status(200).send(balance);
  } catch (error) {
    console.log(chalk.bold.red(`${error} at get /balance`));
  }
}

export async function postValue(req, res) {
  const { description, type, value } = req.body;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");

  try {
    const session = await db.collection("sessions").findOne({ token });

    const user = await db.collection("users").findOne({
      _id: session.userId,
    });

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
