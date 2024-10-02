import { Router } from "express";
import {
  activityPlanValidation,
  memoValidationComment,
} from "../middleware/validator";
import { ActivityPlanController } from "../controllers/activityPlan.controller";
import { verifyToken } from "../middleware/verifyToken";

export class ActivityPlanRouter {
  private router: Router;
  private activityPlanController: ActivityPlanController;

  constructor() {
    this.router = Router();
    this.activityPlanController = new ActivityPlanController();
    this.init();
  }

  private init(): void {
    this.router.post(
      "/",
      activityPlanValidation,
      verifyToken,
      this.activityPlanController.createActivityPlan
    );
    this.router.post(
      "/comment/:id",
      memoValidationComment,
      verifyToken,
      this.activityPlanController.createActivityPlanComment
    );
    this.router.patch(
      "/:id",
      activityPlanValidation,
      verifyToken,
      this.activityPlanController.updateActivityPlan
    );
    this.router.get(
      "/",
      verifyToken,
      this.activityPlanController.getActivityPlans
    );
    this.router.get(
      "/:userId",
      verifyToken,
      this.activityPlanController.getActivityPlansByUserId
    );
    this.router.get(
      "/:userId/:startDate/:endDate/:lecturer",
      verifyToken,
      this.activityPlanController.getActivityPlansByUserIdByDate
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
