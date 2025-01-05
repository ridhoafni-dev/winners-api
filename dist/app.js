"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sample_router_1 = require("./routers/sample.router");
const auth_router_1 = require("./routers/auth.router");
const posts_router_1 = require("./routers/posts.router");
const selfEvaluation_router_1 = require("./routers/selfEvaluation.router");
const memo_router_1 = require("./routers/memo.router");
const observation_router_1 = require("./routers/observation.router");
const activityPlan_router_1 = require("./routers/activityPlan.router");
const report_router_1 = require("./routers/report.router");
const PORT = 8080;
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure(); //execute config method
        this.routers();
        this.handleError();
    }
    configure() {
        this.app.use((0, cors_1.default)()); // to give access for frontend
        this.app.use(express_1.default.json()); // to read request
        this.app.use(express_1.default.urlencoded({ extended: true })); // to accept req.body from type
    }
    // Define error handling
    handleError() {
        // error
        this.app.use((error, req, res, next) => {
            if (req.path.includes("/api/")) {
                console.error("Error : ", error);
                res.status(500).send({ status: false, message: `${error}` });
            }
            else {
                next();
            }
        });
        // not found
        this.app.use((err, req, res, next) => {
            if (req.path.includes("/api/")) {
                console.error("Error : ", err);
                res.status(500).send(err);
            }
            else {
                next();
            }
        });
    }
    routers() {
        const sampleRouter = new sample_router_1.SampleRouter();
        const authRouter = new auth_router_1.AuthRouters();
        const postsRouter = new posts_router_1.PostsRouter();
        const selfEvaluationRouter = new selfEvaluation_router_1.SelfEvaluationRouter();
        const memoRouter = new memo_router_1.MemoRouter();
        const observationRouter = new observation_router_1.ObservationRouter();
        const activityPlanRouter = new activityPlan_router_1.ActivityPlanRouter();
        const reportRouter = new report_router_1.ReportRouter();
        this.app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            return res.status(200).send("Hello World!!");
        }));
        this.app.use(express_1.default.static("public"));
        this.app.use("/samples", sampleRouter.getRouter());
        this.app.use("/posts", postsRouter.getRouter());
        this.app.use("/api/auth", authRouter.getRouter());
        this.app.use("/api/reflections", selfEvaluationRouter.getRouter());
        this.app.use("/api/memos", memoRouter.getRouter());
        this.app.use("/api/observations", observationRouter.getRouter());
        this.app.use("/api/plans", activityPlanRouter.getRouter());
        this.app.use("/api/reports", reportRouter.getRouter());
    }
    start() {
        //await redisClient.connect();
        this.app.listen(PORT, () => {
            console.log(`API RUNNING : http//localhost:${PORT}`);
        });
    }
}
exports.default = App;
