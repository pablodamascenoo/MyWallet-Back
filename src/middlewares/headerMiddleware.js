import db from "../db.js";
import chalk from "chalk";

export async function validTokenAndUser(req, res, next) {
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
  } catch (error) {
    console.log(chalk.bold.red(`${error} in token and user middleware`));
    return res.sendStatus(500);
  }

  next();
}