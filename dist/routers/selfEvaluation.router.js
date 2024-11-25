"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfEvaluationRouter = void 0;
const express_1 = require("express");
const selfReflection_controller_1 = require("../controllers/selfReflection.controller");
const validator_1 = require("../middleware/validator");
const verifyToken_1 = require("../middleware/verifyToken");
class SelfEvaluationRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.selfEvaluationController = new selfReflection_controller_1.SelfReflectionController();
        this.init();
    }
    init() {
        this.router.post("/", validator_1.selfEvaluationValidation, verifyToken_1.verifyToken, this.selfEvaluationController.createSelfReflection);
        this.router.post("/comment/:id", validator_1.selfEvaluationValidationComment, verifyToken_1.verifyToken, this.selfEvaluationController.createSelfReflectionComment);
        this.router.patch("/:id", validator_1.selfEvaluationValidation, verifyToken_1.verifyToken, this.selfEvaluationController.updateSelfReflection);
        this.router.get("/", verifyToken_1.verifyToken, this.selfEvaluationController.getSelfReflections);
        this.router.get("/:userId", verifyToken_1.verifyToken, this.selfEvaluationController.getSelfReflectionByUserId);
        this.router.get("/:userId/:startDate/:endDate/:lecturer", verifyToken_1.verifyToken, this.selfEvaluationController.getSelfReflectionByUserIdByDate);
    }
    getRouter() {
        return this.router;
    }
}
exports.SelfEvaluationRouter = SelfEvaluationRouter;
