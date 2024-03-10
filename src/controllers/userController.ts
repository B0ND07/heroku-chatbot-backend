import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email or username already exists" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: hash,
    };

    const user = await User.create(newUser);

    const token = jwt.sign({ id: user._id,email:user.email }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    //expire in two day (that 2 indicates day)

    const options = {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "None" as any,
    };
    res.cookie("token", token, options);

    res.json({ user });
  } catch (err) {
    res.json(err);
    console.log(err);
  }
};

export const userSignin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.json("User not found!");

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) return res.json("Wrong password or username!");

    const token = jwt.sign({ id: user._id,email:user.email }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    //expire in two day (that 2 indicates day)

    const options = {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "None" as any,
    };
    res.cookie("token", token, options);

    res.json({ user });
  } catch (err) {
    res.json(err);
    console.log(err);
  }
};

export const verifyUser = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.json("Please Login to access this resource.");
    } else {
      const decodedData = jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as JwtPayload;
      const user = await User.findById(decodedData.id);

      if (!user) {
        return res.json("Please Login to access this resource.");
      }

      req.user = user;
      return res
        .status(200)
        .json({ message: "OK", name: user.name, email: user.email });
    }
  } catch (err) {}
};

export const userLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "None" as any,
    });


    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
