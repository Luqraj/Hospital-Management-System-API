import express from "express"
import { registerUser, loginUser } from "../controllers/auth.controllers.js"

const authRouter = express.Router();

authRouter
  .post("/register", registerUser)
  .post("/login", loginUser)
  // .get("/users", getAllUsers)
  // .delete("/delete", deleteUsers)

export default authRouter;