import { Router, Request, Response, NextFunction } from "express";
import { selfEvaluationValidation, selfEvaluationValidationComment } from "../middleware/validator";
import { verifyToken } from "../middleware/verifyToken";
import { SelfEvaluationController } from "../controllers/selfReflection.controller";

export class SelfEvaluationRouter {
  private router: Router;
  private selfEvaluationController: SelfEvaluationController ;

  constructor() {
    this.router = Router();
    this.selfEvaluationController = new SelfEvaluationController();
    this.init();
  }

  private init(): void {
    // Create bound methods for router handlers
    const createSelfEvaluation = (req: Request, res: Response, next: NextFunction) => {
      this.selfEvaluationController.createSelfEvaluation(req, res, next);
    };
    
    const createSelfEvaluationComment = (req: Request, res: Response, next: NextFunction) => {
      this.selfEvaluationController.createSelfEvaluationComment(req, res, next);
    };
    
    const updateSelfEvaluation = (req: Request, res: Response, next: NextFunction) => {
      this.selfEvaluationController.updateSelfEvaluation(req, res, next);
    };

    
    const getSelfEvaluationById = (req: Request, res: Response, next: NextFunction) => {
      this.selfEvaluationController.getSelfEvaluationById(req, res, next);
    };
  

    const getSelfEvaluationsByUserIdByDate = (req: Request, res: Response, next: NextFunction) => {
      this.selfEvaluationController.getSelfEvaluationsByUserIdByDate(req, res, next);
    };

    // Register routes with bound methods
    this.router.post(
      "/",
      verifyToken,
      selfEvaluationValidation,
      createSelfEvaluation
    );
    
    this.router.post(
      "/comment/:id",
      verifyToken,
      selfEvaluationValidationComment,
      createSelfEvaluationComment
    );
    
    this.router.patch(
      "/:id",
      verifyToken,
      selfEvaluationValidation,
      updateSelfEvaluation
    );
        
    this.router.get("/:id", verifyToken, getSelfEvaluationById);
        
    this.router.get(
      "/:userId/:startDate/:endDate/:lecturer",
      verifyToken,
      getSelfEvaluationsByUserIdByDate
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
