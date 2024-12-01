import { Router } from "express";
import {
  memoValidationComment,
  observationValidation,
} from "../middleware/validator";
import { ObservationController } from "../controllers/observation.controller";
import { uploader } from "../middleware/uploader";
import { verifyToken } from "../middleware/verifyToken";
import { handleUpload } from "../utils/supabaseStorage";

export class ObservationRouter {
  private router: Router;
  private observationController: ObservationController;

  constructor() {
    this.router = Router();
    this.observationController = new ObservationController();
    this.init();
  }

  private init(): void {
    this.router.post(
      "/",
      //uploader("IMG", "/image").single("image"),
      verifyToken,
      handleUpload,
      observationValidation,
      this.observationController.createObservation
    );
    this.router.post(
      "/comment/:id",
      verifyToken,
      memoValidationComment,
      this.observationController.createObservationComment
    );
    this.router.patch(
      "/:id",
      handleUpload,
      verifyToken,
      // uploader("IMG", "/image").single("image"),
      this.observationController.updateObservation
    );
    this.router.get(
      "/",
      verifyToken,
      this.observationController.getObservations
    );
    this.router.get(
      "/:userId",
      verifyToken,
      this.observationController.getObservationsByUserId
    );
    this.router.get(
      "/:userId/:startDate/:endDate/:lecturer",
      verifyToken,
      this.observationController.getObservationsByUserIdByDate
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
