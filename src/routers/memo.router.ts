import { Router, Request, Response, NextFunction } from "express";
import { memoValidation, memoValidationComment } from "../middleware/validator";
import { MemoController } from "../controllers/memo.controller";
import { verifyToken } from "../middleware/verifyToken";

export class MemoRouter {
  private router: Router;
  private memoController: MemoController;

  constructor() {
    this.router = Router();
    this.memoController = new MemoController();
    this.init();
  }

  private init(): void {
    // Create wrapper functions to ensure proper binding
    const createMemo = (req: Request, res: Response, next: NextFunction) => {
      this.memoController.createMemo(req, res, next);
    };
    
    const createMemoComment = (req: Request, res: Response, next: NextFunction) => {
      this.memoController.createMemoComment(req, res, next);
    };
    
    const updateMemo = (req: Request, res: Response, next: NextFunction) => {
      this.memoController.updateMemo(req, res, next);
    };
    
    const getMemos = (req: Request, res: Response, next: NextFunction) => {
      this.memoController.getMemos(req, res, next);
    };
    
    const getMemoById = (req: Request, res: Response, next: NextFunction) => {
      this.memoController.getMemoById(req, res, next);
    };
    
    const getMemosByUserIdByDate = (req: Request, res: Response, next: NextFunction) => {
      this.memoController.getMemosByUserIdByDate(req, res, next);
    };

    // Register routes with proper handlers
    this.router.post("/", memoValidation, verifyToken, createMemo);
    this.router.post("/comment/:id", memoValidationComment, verifyToken, createMemoComment);
    this.router.patch("/:id", memoValidation, verifyToken, updateMemo);
    this.router.get("/", verifyToken, getMemos);
    this.router.get("/:id", verifyToken, getMemoById);
    this.router.get("/:userId/:startDate/:endDate/:lecturer", verifyToken, getMemosByUserIdByDate);
  }

  getRouter(): Router {
    return this.router;
  }
}