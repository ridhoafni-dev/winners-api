import { Request, Response, NextFunction } from "express";
import { decode, verify } from "jsonwebtoken";
import { redisClient } from "../helpers/redis";

declare global {
  namespace Express {
    interface Request {
      dataUser: any;
    }
  }
}
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    console.log("token", token);
    if (!token) {
      return res
        .status(403)
        .send({ status: false, message: "Token not found" });
    }

    // Mengambil data token dari redis dan dicocokkan dengan token dari header
    //const checkToken = await redisClient.get(`forgot:${req.body.email}`);
    //console.log(token, checkToken);

    if (token) {
      const verifiedToken = verify(token, "123jwt");
      req.dataUser = verifiedToken;
      next();
    } else {
      return res
        .status(401)
        .send({ status: false, message: "Failed to authenticate token." });
    }
  } catch (error) {
    return res.status(401).send({ status: false, message: "Token error" });
  }
};
