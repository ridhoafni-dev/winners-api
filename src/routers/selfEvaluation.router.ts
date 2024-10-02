import { Router } from "express";
import { SelfReflectionController } from "../controllers/selfReflection.controller";
import {
  selfEvaluationValidation,
  selfEvaluationValidationComment,
} from "../middleware/validator";
import { verifyToken } from "../middleware/verifyToken";

export class SelfEvaluationRouter {
  private router: Router;
  private selfEvaluationController: SelfReflectionController;

  constructor() {
    this.router = Router();
    this.selfEvaluationController = new SelfReflectionController();
    this.init();
  }

  private init(): void {
    this.router.post(
      "/",
      selfEvaluationValidation,
      verifyToken,
      this.selfEvaluationController.createSelfReflection
    );
    this.router.post(
      "/comment/:id",
      selfEvaluationValidationComment,
      verifyToken,
      this.selfEvaluationController.createSelfReflectionComment
    );
    this.router.patch(
      "/:id",
      selfEvaluationValidation,
      verifyToken,
      this.selfEvaluationController.updateSelfReflection
    );
    this.router.get(
      "/",
      verifyToken,
      this.selfEvaluationController.getSelfReflections
    );
    this.router.get(
      "/:userId",
      verifyToken,
      this.selfEvaluationController.getSelfReflectionByUserId
    );

    this.router.get(
      "/:userId/:startDate/:endDate/:lecturer",
      verifyToken,
      this.selfEvaluationController.getSelfReflectionByUserIdByDate
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
