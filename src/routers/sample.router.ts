import { Router } from "express";
import { SampleController } from "../controllers/sample.controller";

export class SampleRouter {
  private router: Router;
  private sampleContoller: SampleController;

  constructor() {
    this.router = Router();
    this.sampleContoller = new SampleController();
    this.init();
  }

  private init(): void {
    this.router.get("/", this.sampleContoller.getSample);
    this.router.post("/", this.sampleContoller.createSample);
  }

  getRouter(): Router {
    return this.router;
  }
}
