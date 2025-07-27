import { Router, Request, Response, NextFunction } from "express";
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
    // Create bound methods for router handlers
    const createReport = (req: Request, res: Response, next: NextFunction) => {
      this.reportController.createReport(req, res, next);
    };
    
    const updateReport = (req: Request, res: Response, next: NextFunction) => {
      this.reportController.updateReport(req, res, next);
    };
    
    const getReportById = (req: Request, res: Response, next: NextFunction) => {
      this.reportController.getReportById(req, res, next);
    };
    
    const getReportsByUserId = (req: Request, res: Response, next: NextFunction) => {
      this.reportController.getReportsByUserId(req, res, next);
    };
    
    const getReportsByUserIdByDate = (req: Request, res: Response, next: NextFunction) => {
      this.reportController.getReportsByUserIdByDate(req, res, next);
    };
    
    const downloadDocument = (req: Request, res: Response, next: NextFunction) => {
      this.reportController.downloadDocument(req, res, next);
    };
    
    this.router.post(
      "/",
      verifyToken,
      uploader("DOC", "/document").single("document"),
      reportValidation,
      createReport
    );
    this.router.patch(
      "/:id",
      verifyToken,
      uploader("DOC", "/document").single("document"),
      reportValidation,
      updateReport
    );
    this.router.get("/:id", verifyToken, getReportById);
    this.router.get(
      "/:userId",
      verifyToken,
      getReportsByUserId
    );
    this.router.get(
      "/:userId/:startDate/:endDate/:lecturer",
      verifyToken,
      getReportsByUserIdByDate
    );
    this.router.get(
      "/download/:id",
      verifyToken,
      downloadDocument
    );
  }

  getRouter(): Router {
    return this.router;
  }
}