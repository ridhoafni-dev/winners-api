import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import fs from "fs";

export const regisValidation = [
  body("email").isEmail().withMessage("Email WRONG"),
  body("email").notEmpty().withMessage("Email required"),
  body("name").notEmpty().withMessage("Name required"),
  body("name")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Name min 6 character"),
  body("address").notEmpty().withMessage("Address required"),
  body("address")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Address min 6 character"),
  body("nim").notEmpty().withMessage("NIM required"),
  body("nim")
    .optional()
    .isLength({ min: 8 })
    .withMessage("NIM min 8 character"),
  body("stase").notEmpty().withMessage("Stase required"),
  body("stase")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Stase min 6 character"),
  body("startSchoolYear").notEmpty().withMessage("Start School Year required"),
  body("startSchoolYear")
    .optional()
    .isLength({ min: 4 })
    .isNumeric()
    .withMessage("End School Year min 4 character and number"),
  body("endSchoolYear").notEmpty().withMessage("End School Year required"),
  body("endSchoolYear")
    .optional()
    .isLength({ min: 4 })
    .isNumeric()
    .withMessage("End School Year min 4 character and number"),
  body("password").notEmpty().withMessage("Password required"),
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

export const loginValidation = [
  body("email").isEmail().withMessage("Email WRONG"),
  body("email").notEmpty().withMessage("Email required"),
  body("password").notEmpty().withMessage("Password required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errorValidator = validationResult(req); // untuk menampung jika ada error dari middleware validator
    if (!errorValidator.isEmpty()) {
      // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
      return res.status(400).send({ error: errorValidator.array() });
    }
    next(); // jika error validator kosong maka lanjut ke controller register
  },
];

export const selfEvaluationValidation = [
  body("userId").notEmpty().withMessage("UserId WRONG"),
  body("userId").optional().isNumeric().withMessage("UserId mush be number"),
  body("description").notEmpty().withMessage("Description required"),
  body("description")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Description must be min 3 character"),
  (req: Request, res: Response, next: NextFunction) => {
    const errorValidator = validationResult(req); // untuk menampung jika ada error dari middleware validator
    if (!errorValidator.isEmpty()) {
      // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
      return res.status(400).send({ error: errorValidator.array() });
    }
    next(); // jika error validator kosong maka lanjut ke controller register
  },
];

export const memoValidation = [
  body("userId").notEmpty().withMessage("UserId WRONG"),
  body("userId").optional().isNumeric().withMessage("UserId mush be number"),
  body("title").notEmpty().withMessage("Title required"),
  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Title must be min 3 character"),
  (req: Request, res: Response, next: NextFunction) => {
    const errorValidator = validationResult(req); // untuk menampung jika ada error dari middleware validator
    if (!errorValidator.isEmpty()) {
      // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
      return res.status(400).send({ error: errorValidator.array() });
    }
    next(); // jika error validator kosong maka lanjut ke controller register
  },
];

export const selfEvaluationValidationComment = [
  body("userId").notEmpty().withMessage("UserId WRONG"),
  body("userId").notEmpty().withMessage("UserId WRONG"),
  body("rating").notEmpty().withMessage("Rating WRONG"),
  body("rating").optional().isNumeric().withMessage("Rating mush be number"),
  (req: Request, res: Response, next: NextFunction) => {
    const errorValidator = validationResult(req); // untuk menampung jika ada error dari middleware validator
    if (!errorValidator.isEmpty()) {
      // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
      return res.status(400).send({ error: errorValidator.array() });
    }
    next(); // jika error validator kosong maka lanjut ke controller register
  },
];

export const memoValidationComment = [
  body("userId").notEmpty().withMessage("UserId WRONG"),
  body("userId").notEmpty().withMessage("UserId WRONG"),
  body("rating").notEmpty().withMessage("Rating WRONG"),
  body("rating").optional().isNumeric().withMessage("Rating mush be number"),
  (req: Request, res: Response, next: NextFunction) => {
    const errorValidator = validationResult(req); // untuk menampung jika ada error dari middleware validator
    if (!errorValidator.isEmpty()) {
      // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
      return res.status(400).send({ error: errorValidator.array() });
    }
    next(); // jika error validator kosong maka lanjut ke controller register
  },
];

export const observationValidation = [
  body("userId").notEmpty().withMessage("UserId required"),
  body("userId").optional().isNumeric().withMessage("UserId mush be number"),
  body("name").notEmpty().withMessage("Name required"),
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be min 3 character"),
  body("date").notEmpty().withMessage("Date required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errorValidator = validationResult(req); // untuk menampung jika ada error dari middleware validator
    if (!errorValidator.isEmpty()) {
      // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
      fs.unlink(`./public/image/${req.file?.filename}`, () => {});
      return res.status(400).send({ error: errorValidator.array() });
    }
    next(); // jika error validator kosong maka lanjut ke controller register
  },
];

export const reportValidation = [
  body("userId").notEmpty().withMessage("UserId required"),
  body("userId").optional().isNumeric().withMessage("UserId mush be number"),
  // body("lecturerId").notEmpty().withMessage("Lecturer required"),
  // body("lecturerId")
  //   .optional()
  //   .isNumeric()
  //   .withMessage("Lecturer mush be number"),
  // body("date").notEmpty().withMessage("Date required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errorValidator = validationResult(req); // untuk menampung jika ada error dari middleware validator
    if (!errorValidator.isEmpty()) {
      // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
      // fs.unlink(`./public/document/${req.file?.filename}`, () => {});
      // return res.status(400).send({ error: errorValidator.array() });
    }
    next(); // jika error validator kosong maka lanjut ke controller register
  },
];

export const activityPlanValidation = [
  body("userId").notEmpty().withMessage("UserId WRONG"),
  body("userId").optional().isNumeric().withMessage("UserId mush be number"),
  body("name").notEmpty().withMessage("Name required"),
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be min 3 character"),
  body("startDate").notEmpty().withMessage("Start date required"),
  body("endDate").notEmpty().withMessage("End date required"),
  body("status").notEmpty().withMessage("Status required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errorValidator = validationResult(req); // untuk menampung jika ada error dari middleware validator
    if (!errorValidator.isEmpty()) {
      // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
      return res.status(400).send({ error: errorValidator.array() });
    }
    next(); // jika error validator kosong maka lanjut ke controller register
  },
];
