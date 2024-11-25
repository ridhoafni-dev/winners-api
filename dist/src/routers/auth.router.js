"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouters = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validator_1 = require("../middleware/validator");
const verifyToken_1 = require("../middleware/verifyToken");
class AuthRouters {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authController = new auth_controller_1.AuthController();
        this.init();
    }
    init() {
        this.router.post("/register", validator_1.regisValidation, this.authController.registerUser);
        this.router.post("/login", validator_1.loginValidation, this.authController.loginUser);
        this.router.get("/lecturers", this.authController.getLecturers);
        this.router.get("/users/:startDate/:endDate/:role", this.authController.getUsersByRoleByDate);
        this.router.post("/forgotPassword", this.authController.forgotPassword);
        this.router.post("reset", verifyToken_1.verifyToken, this.authController.resetPassword);
        this.router.put("/user/updateUserStatus/:id", verifyToken_1.verifyToken, this.authController.updateUserStatus);
    }
    getRouter() {
        return this.router;
    }
}
exports.AuthRouters = AuthRouters;
