import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const resetPasswordValidation = [
  body("password").notEmpty().withMessage("Password is required"),
  body("password")
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      minUppercase: 0,
    })
    .withMessage("Password min 6, alpha min 1, digit min 1"),
  (req: Request, res: Response, next: NextFunction) => {
    const errorValidator = validationResult(req); // untuk menampung jika ada error dari middleware validator
    if (!errorValidator.isEmpty()) {
      // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
      return res.status(400).send({ error: errorValidator.array() });
    }

    next(); // jika error validator kosong maka lanjut ke controller register
  },
];
