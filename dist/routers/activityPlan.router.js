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
        // Bind controller methods to maintain context
        const createActivityPlan = this.activityPlanController.createActivityPlan.bind(this.activityPlanController);
        const createActivityPlanComment = this.activityPlanController.createActivityPlanComment.bind(this.activityPlanController);
        const updateActivityPlan = this.activityPlanController.updateActivityPlan.bind(this.activityPlanController);
        const getActivityPlans = this.activityPlanController.getActivityPlans.bind(this.activityPlanController);
        const getActivityPlanById = this.activityPlanController.getActivityPlanById.bind(this.activityPlanController);
        const getActivityPlansByUserIdByDate = this.activityPlanController.getActivityPlansByUserIdByDate.bind(this.activityPlanController);
        this.router.post("/", validator_1.activityPlanValidation, verifyToken_1.verifyToken, createActivityPlan);
        this.router.post("/comment/:id", validator_1.memoValidationComment, verifyToken_1.verifyToken, createActivityPlanComment);
        this.router.patch("/:id", validator_1.activityPlanValidation, verifyToken_1.verifyToken, updateActivityPlan);
        this.router.get("/", verifyToken_1.verifyToken, getActivityPlans);
        this.router.get("/:id", verifyToken_1.verifyToken, getActivityPlanById);
        this.router.get("/:userId/:startDate/:endDate/:lecturer", verifyToken_1.verifyToken, getActivityPlansByUserIdByDate);
    }
    getRouter() {
        return this.router;
    }
}
exports.ActivityPlanRouter = ActivityPlanRouter;
