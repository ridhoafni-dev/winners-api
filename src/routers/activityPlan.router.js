"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityPlanRouter = void 0;
const express_1 = require("express");
const validator_1 = require("../middleware/validator");
const activityPlan_controller_1 = require("../controllers/activityPlan.controller");
const verifyToken_1 = require("../middleware/verifyToken");
class ActivityPlanRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.activityPlanController = new activityPlan_controller_1.ActivityPlanController();
        this.init();
    }
    init() {
        this.router.post("/", validator_1.activityPlanValidation, verifyToken_1.verifyToken, this.activityPlanController.createActivityPlan);
        this.router.post("/comment/:id", validator_1.memoValidationComment, verifyToken_1.verifyToken, this.activityPlanController.createActivityPlanComment);
        this.router.patch("/:id", validator_1.activityPlanValidation, verifyToken_1.verifyToken, this.activityPlanController.updateActivityPlan);
        this.router.get("/", verifyToken_1.verifyToken, this.activityPlanController.getActivityPlans);
        this.router.get("/:userId", verifyToken_1.verifyToken, this.activityPlanController.getActivityPlansByUserId);
        this.router.get("/:userId/:startDate/:endDate/:lecturer", verifyToken_1.verifyToken, this.activityPlanController.getActivityPlansByUserIdByDate);
    }
    getRouter() {
        return this.router;
    }
}
exports.ActivityPlanRouter = ActivityPlanRouter;
