import { Response,Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const createToken = (id: string, email: string, expiresIn: string) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};

export const verifyToken = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;

    if (!token) {
        return res.json("Please Login to access this resource.")
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET) as any
    console.log("decoded",decodedData);
    
    const user = await User.findById(decodedData.id)

    if (!user) {
        return res.json("Please Login to access this resource.")
    }

    req.user = user;
    console.log("req.user",req.user);
    
    next();
      
  }