import { Router } from "express";
import {
  userLogout,
  userSignin,
  userSignup,
  verifyUser,
} from "../controllers/userController.js";


const userRoute = Router();

userRoute.post("/signin", userSignin);
userRoute.post("/signup", userSignup);
userRoute.get("/auth-status", verifyUser);
userRoute.get("/logout", userLogout);

export default userRoute;