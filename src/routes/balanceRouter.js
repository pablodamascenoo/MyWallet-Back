import express from "express";
import { getBalance, postValue } from "../controllers/balanceController.js";

const balanceRouter = express.Router();

balanceRouter.get("/balance", getBalance);
balanceRouter.post("/balance", postValue);

export default balanceRouter;
