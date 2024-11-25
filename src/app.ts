import express, {
  Express,
  json,
  urlencoded,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";
import { SampleRouter } from "./routers/sample.router";
import { AuthRouters } from "./routers/auth.router";
import { redisClient } from "./helpers/redis";
import { PostsRouter } from "./routers/posts.router";
import { SelfEvaluationRouter } from "./routers/selfEvaluation.router";
import { MemoRouter } from "./routers/memo.router";
import { ObservationRouter } from "./routers/observation.router";
import { ActivityPlanRouter } from "./routers/activityPlan.router";
import { ReportRouter } from "./routers/report.router";

const PORT = 8080;

export default class App {
  readonly app: Express;

  constructor() {
    this.app = express();
    this.configure(); //execute config method
    this.routers();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors()); // to give access for frontend
    this.app.use(json()); // to read request
    this.app.use(urlencoded({ extended: true })); // to accept req.body from type
  }

  // Define error handling
  private handleError(): void {
    // error
    this.app.use(
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes("/api/")) {
          console.error("Error : ", error);
          res.status(500).send({ status: false, message: `${error}` });
        } else {
          next();
        }
      }
    );

    // not found
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes("/api/")) {
          console.error("Error : ", err);
          res.status(500).send(err);
        } else {
          next();
        }
      }
    );
  }

  private routers(): void {
    const sampleRouter = new SampleRouter();
    const authRouter = new AuthRouters();
    const postsRouter = new PostsRouter();
    const selfEvaluationRouter = new SelfEvaluationRouter();
    const memoRouter = new MemoRouter();
    const observationRouter = new ObservationRouter();
    const activityPlanRouter = new ActivityPlanRouter();
    const reportRouter = new ReportRouter();

    this.app.get("/", async (req: Request, res: Response) => {
      return res.status(200).send("Hello World");
    });
    // this.app.use(express.static("public"));
    this.app.use("/samples", sampleRouter.getRouter());
    this.app.use("/posts", postsRouter.getRouter());
    this.app.use("/api/auth", authRouter.getRouter());
    this.app.use("/api/reflections", selfEvaluationRouter.getRouter());
    this.app.use("/api/memos", memoRouter.getRouter());
    this.app.use("/api/observations", observationRouter.getRouter());
    this.app.use("/api/plans", activityPlanRouter.getRouter());
    this.app.use("/api/reports", reportRouter.getRouter());
  }

  public start(): void {
    //await redisClient.connect();
    this.app.listen(PORT, () => {
      console.log(`API RUNNING : http//localhost:${PORT}`);
    });
  }
}
