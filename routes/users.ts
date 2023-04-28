import express from "express";
import { getUsers } from "../controllers/users";

const usersRouter = express.Router();

usersRouter.get('/', getUsers);

export default usersRouter;