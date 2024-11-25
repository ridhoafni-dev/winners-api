"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityPlanValidation = exports.reportValidation = exports.observationValidation = exports.memoValidationComment = exports.selfEvaluationValidationComment = exports.memoValidation = exports.selfEvaluationValidation = exports.loginValidation = exports.regisValidation = void 0;
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
exports.regisValidation = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Email WRONG"),
    (0, express_validator_1.body)("email").notEmpty().withMessage("Email required"),
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name required"),
    (0, express_validator_1.body)("name")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Name min 6 character"),
    (0, express_validator_1.body)("address").notEmpty().withMessage("Address required"),
    (0, express_validator_1.body)("address")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Address min 6 character"),
    (0, express_validator_1.body)("nim").notEmpty().withMessage("NIM required"),
    (0, express_validator_1.body)("nim")
        .optional()
        .isLength({ min: 8 })
        .withMessage("NIM min 8 character"),
    (0, express_validator_1.body)("stase").notEmpty().withMessage("Stase required"),
    (0, express_validator_1.body)("stase")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Stase min 6 character"),
    (0, express_validator_1.body)("startSchoolYear").notEmpty().withMessage("Start School Year required"),
    (0, express_validator_1.body)("startSchoolYear")
        .optional()
        .isLength({ min: 4 })
        .isNumeric()
        .withMessage("End School Year min 4 character and number"),
    (0, express_validator_1.body)("endSchoolYear").notEmpty().withMessage("End School Year required"),
    (0, express_validator_1.body)("endSchoolYear")
        .optional()
        .isLength({ min: 4 })
        .isNumeric()
        .withMessage("End School Year min 4 character and number"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password required"),
    (0, express_validator_1.body)("password")
        .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 0,
        minUppercase: 0,
    })
        .withMessage("Password min 6, alpha min 1, digit min 1"),
    (req, res, next) => {
        const errorValidator = (0, express_validator_1.validationResult)(req); // untuk menampung jika ada error dari middleware validator
        if (!errorValidator.isEmpty()) {
            // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
            return res.status(400).send({ error: errorValidator.array() });
        }
        next(); // jika error validator kosong maka lanjut ke controller register
    },
];
exports.loginValidation = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Email WRONG"),
    (0, express_validator_1.body)("email").notEmpty().withMessage("Email required"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password required"),
    (req, res, next) => {
        const errorValidator = (0, express_validator_1.validationResult)(req); // untuk menampung jika ada error dari middleware validator
        if (!errorValidator.isEmpty()) {
            // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
            return res.status(400).send({ error: errorValidator.array() });
        }
        next(); // jika error validator kosong maka lanjut ke controller register
    },
];
exports.selfEvaluationValidation = [
    (0, express_validator_1.body)("userId").notEmpty().withMessage("UserId WRONG"),
    (0, express_validator_1.body)("userId").optional().isNumeric().withMessage("UserId mush be number"),
    (0, express_validator_1.body)("description").notEmpty().withMessage("Description required"),
    (0, express_validator_1.body)("description")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Description must be min 3 character"),
    (req, res, next) => {
        const errorValidator = (0, express_validator_1.validationResult)(req); // untuk menampung jika ada error dari middleware validator
        if (!errorValidator.isEmpty()) {
            // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
            return res.status(400).send({ error: errorValidator.array() });
        }
        next(); // jika error validator kosong maka lanjut ke controller register
    },
];
exports.memoValidation = [
    (0, express_validator_1.body)("userId").notEmpty().withMessage("UserId WRONG"),
    (0, express_validator_1.body)("userId").optional().isNumeric().withMessage("UserId mush be number"),
    (0, express_validator_1.body)("title").notEmpty().withMessage("Title required"),
    (0, express_validator_1.body)("title")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Title must be min 3 character"),
    (req, res, next) => {
        const errorValidator = (0, express_validator_1.validationResult)(req); // untuk menampung jika ada error dari middleware validator
        if (!errorValidator.isEmpty()) {
            // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
            return res.status(400).send({ error: errorValidator.array() });
        }
        next(); // jika error validator kosong maka lanjut ke controller register
    },
];
exports.selfEvaluationValidationComment = [
    (0, express_validator_1.body)("userId").notEmpty().withMessage("UserId WRONG"),
    (0, express_validator_1.body)("userId").notEmpty().withMessage("UserId WRONG"),
    (0, express_validator_1.body)("rating").notEmpty().withMessage("Rating WRONG"),
    (0, express_validator_1.body)("rating").optional().isNumeric().withMessage("Rating mush be number"),
    (req, res, next) => {
        const errorValidator = (0, express_validator_1.validationResult)(req); // untuk menampung jika ada error dari middleware validator
        if (!errorValidator.isEmpty()) {
            // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
            return res.status(400).send({ error: errorValidator.array() });
        }
        next(); // jika error validator kosong maka lanjut ke controller register
    },
];
exports.memoValidationComment = [
    (0, express_validator_1.body)("userId").notEmpty().withMessage("UserId WRONG"),
    (0, express_validator_1.body)("userId").notEmpty().withMessage("UserId WRONG"),
    (0, express_validator_1.body)("rating").notEmpty().withMessage("Rating WRONG"),
    (0, express_validator_1.body)("rating").optional().isNumeric().withMessage("Rating mush be number"),
    (req, res, next) => {
        const errorValidator = (0, express_validator_1.validationResult)(req); // untuk menampung jika ada error dari middleware validator
        if (!errorValidator.isEmpty()) {
            // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
            return res.status(400).send({ error: errorValidator.array() });
        }
        next(); // jika error validator kosong maka lanjut ke controller register
    },
];
exports.observationValidation = [
    (0, express_validator_1.body)("userId").notEmpty().withMessage("UserId required"),
    (0, express_validator_1.body)("userId").optional().isNumeric().withMessage("UserId mush be number"),
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name required"),
    (0, express_validator_1.body)("name")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Name must be min 3 character"),
    (0, express_validator_1.body)("date").notEmpty().withMessage("Date required"),
    (req, res, next) => {
        var _a;
        const errorValidator = (0, express_validator_1.validationResult)(req); // untuk menampung jika ada error dari middleware validator
        if (!errorValidator.isEmpty()) {
            // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
            fs_1.default.unlink(`./public/image/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}`, () => { });
            return res.status(400).send({ error: errorValidator.array() });
        }
        next(); // jika error validator kosong maka lanjut ke controller register
    },
];
exports.reportValidation = [
    (0, express_validator_1.body)("userId").notEmpty().withMessage("UserId required"),
    (0, express_validator_1.body)("userId").optional().isNumeric().withMessage("UserId mush be number"),
    (0, express_validator_1.body)("lecturerId").notEmpty().withMessage("Lecturer required"),
    (0, express_validator_1.body)("lecturerId")
        .optional()
        .isNumeric()
        .withMessage("Lecturer mush be number"),
    (0, express_validator_1.body)("date").notEmpty().withMessage("Date required"),
    (req, res, next) => {
        var _a;
        const errorValidator = (0, express_validator_1.validationResult)(req); // untuk menampung jika ada error dari middleware validator
        if (!errorValidator.isEmpty()) {
            // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
            fs_1.default.unlink(`./public/document/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}`, () => { });
            return res.status(400).send({ error: errorValidator.array() });
        }
        next(); // jika error validator kosong maka lanjut ke controller register
    },
];
exports.activityPlanValidation = [
    (0, express_validator_1.body)("userId").notEmpty().withMessage("UserId WRONG"),
    (0, express_validator_1.body)("userId").optional().isNumeric().withMessage("UserId mush be number"),
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name required"),
    (0, express_validator_1.body)("name")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Name must be min 3 character"),
    (0, express_validator_1.body)("startDate").notEmpty().withMessage("Start date required"),
    (0, express_validator_1.body)("endDate").notEmpty().withMessage("End date required"),
    (0, express_validator_1.body)("status").notEmpty().withMessage("Status required"),
    (req, res, next) => {
        const errorValidator = (0, express_validator_1.validationResult)(req); // untuk menampung jika ada error dari middleware validator
        if (!errorValidator.isEmpty()) {
            // Jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
            return res.status(400).send({ error: errorValidator.array() });
        }
        next(); // jika error validator kosong maka lanjut ke controller register
    },
];
