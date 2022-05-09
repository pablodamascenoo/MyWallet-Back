import db from "../db.js";
import chalk from "chalk";

export async function validTokenAndUser(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).send("Sessão expirada");

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!session) return res.status(401).send("Sessão expirada");

    const user = await db.collection("users").findOne({
      _id: session.userId,
    });

    if (!user) return res.status(401).send("Sessão expirada");
  } catch (error) {
    console.log(chalk.bold.red(`${error} in token and user middleware`));
    return res.status(500).send("Erro interno no servidor");
  }

  next();
}
