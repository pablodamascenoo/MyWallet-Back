import db from "./../db.js";
import chalk from "chalk";
import dayjs from "dayjs";

export async function getBalance(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  try {
    const session = db.collection("sessions").findOne({ token });

    if (!session) return res.sendStatus(401);

    const user = db.collection("users").findOne({
      _id: session.userId,
    });

    if (!user) return res.sendStatus(401);

    const balance = await db.collection("balance").find({
      userId: user._id,
    });

    res.send(balance).status(200);
  } catch (error) {
    console.log(chalk.bold.red(`${error} at get /balance`));
  }
}
