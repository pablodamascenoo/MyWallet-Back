import express from "express";
import { getBalance, postValue } from "../controllers/balanceController.js";
import { validTokenAndUser } from "../middlewares/headerMiddleware.js";
import { transactionSchema } from "../middlewares/schemasMiddleware.js";

const balanceRouter = express.Router();

balanceRouter.get("/balance", validTokenAndUser, getBalance);
balanceRouter.post("/balance", validTokenAndUser, transactionSchema, postValue);

export default balanceRouter;
