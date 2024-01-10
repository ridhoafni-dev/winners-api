import express, { Express, json, urlencoded } from "express";
import cors from "cors";
import { SampleRouter } from "./routers/sample.router";

const PORT = 7070;

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure(); //execute config method
    this.routers();
  }

  private configure(): void {
    this.app.use(cors()); // to give access for frontend
    this.app.use(json()); // to read request
    this.app.use(urlencoded({ extended: true })); // to accept req.body from type
  }

  private routers(): void {
    const sampleRouter = new SampleRouter();
    this.app.use("/samples", sampleRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`API RUNNING : http//localhost:${PORT}`);
    });
  }
}
