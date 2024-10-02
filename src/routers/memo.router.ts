import { Router } from "express";
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
    this.router.post(
      "/",
      memoValidation,
      verifyToken,
      this.memoController.createMemo
    );
    this.router.post(
      "/comment/:id",
      memoValidationComment,
      verifyToken,
      this.memoController.createMemoComment
    );
    this.router.patch(
      "/:id",
      memoValidation,
      verifyToken,
      this.memoController.updateMemo
    );
    this.router.get("/", verifyToken, this.memoController.getMemos);
    this.router.get(
      "/:userId",
      verifyToken,
      this.memoController.getMemosByUserId
    );
    this.router.get(
      "/:userId/:startDate/:endDate/:lecturer",
      verifyToken,
      this.memoController.getMemosByUserIdByDate
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
