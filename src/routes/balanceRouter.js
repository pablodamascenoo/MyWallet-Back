import express from "express";
import { getBalance, postValue } from "../controllers/balanceController.js";
import { validTokenAndUser } from "../middlewares/headerMiddleware.js";

const balanceRouter = express.Router();

balanceRouter.get("/balance", validTokenAndUser, getBalance);
balanceRouter.post("/balance", validTokenAndUser, postValue);

export default balanceRouter;
