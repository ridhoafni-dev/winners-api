import { Router, Request, Response, NextFunction } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { ObservationController } from "../controllers/observation.controller";
import { uploader } from "../middleware/uploader";

export class ObservationRouter {
  private router: Router;
  private observationController: ObservationController;

  constructor() {
    this.router = Router();
    this.observationController = new ObservationController();
    this.init();
  }

  private init(): void {
    // Create bound methods for router handlers
    const createObservation = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      this.observationController.createObservation(req, res, next);
    };

    const updateObservation = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      this.observationController.updateObservation(req, res, next);
    };

    const getObservations = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      this.observationController.getObservations(req, res, next);
    };

    const getObservationById = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      this.observationController.getObservationById(req, res, next);
    };

    const getObservationsByUserId = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      this.observationController.getObservationsByUserId(req, res, next);
    };

    const getObservationsByUserIdByDate = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      this.observationController.getObservationsByUserIdByDate(req, res, next);
    };

    // Register routes with bound methods
    this.router.post(
      "/",
      verifyToken,
      uploader("IMG", "/image").single("image"),
      createObservation
    );
    this.router.patch(
      "/:id",
      verifyToken,
      uploader("IMG", "/image").single("image"),
      updateObservation
    );
    this.router.get("/", verifyToken, getObservations);
    this.router.get("/:id", verifyToken, getObservationById);
    this.router.get("/user/:userId", verifyToken, getObservationsByUserId);
    this.router.get(
      "/:userId/:startDate/:endDate/:lecturer",
      verifyToken,
      getObservationsByUserIdByDate
    );
  }

  getRouter(): Router {
    return this.router;
  }
}