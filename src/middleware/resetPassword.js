"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidation = void 0;
const express_validator_1 = require("express-validator");
exports.resetPasswordValidation = [
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
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
