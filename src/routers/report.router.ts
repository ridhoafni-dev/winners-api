import { Router } from "express";
import { reportValidation } from "../middleware/validator";
import { uploader } from "../middleware/uploader";
import { verifyToken } from "../middleware/verifyToken";
import { ReportController } from "../controllers/report.controller";

export class ReportRouter {
  private router: Router;
  private reportController: ReportController;

  constructor() {
    this.router = Router();
    this.reportController = new ReportController();
    this.init();
  }

  private init(): void {
    this.router.post(
      "/",
      verifyToken,
      uploader("DOC", "/document").single("document"),
      reportValidation,
      this.reportController.createReport
    );
    this.router.patch(
      "/:id",
      verifyToken,
      uploader("DOC", "/document").single("document"),
      reportValidation,
      this.reportController.updateReport
    );
    this.router.get("/", verifyToken, this.reportController.getReports);
    this.router.get(
      "/:userId",
      verifyToken,
      this.reportController.getReportsByUserId
    );
    this.router.get(
      "/:userId/:startDate/:endDate/:lecturer",
      verifyToken,
      this.reportController.getReportsByUserIdByDate
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
