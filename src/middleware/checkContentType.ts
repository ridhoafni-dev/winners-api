import { Request, Response, NextFunction } from "express";

export const checkContentType = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const contentType = req.headers["content-type"];

  if (
    contentType &&
    (contentType.includes("application/json") ||
      contentType.includes("application/x-www-form-urlencoded"))
  ) {
    next();
  } else {
    res
      .status(400)
      .json({
        error:
          "Invalid Content-Type. Expected application/json or application/x-www-form-urlencoded",
      });
  }
};
