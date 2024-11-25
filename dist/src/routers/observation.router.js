"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservationRouter = void 0;
const express_1 = require("express");
const validator_1 = require("../middleware/validator");
const observation_controller_1 = require("../controllers/observation.controller");
const uploader_1 = require("../middleware/uploader");
const verifyToken_1 = require("../middleware/verifyToken");
class ObservationRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.observationController = new observation_controller_1.ObservationController();
        this.init();
    }
    init() {
        this.router.post("/", (0, uploader_1.uploader)("IMG", "/image").single("image"), validator_1.observationValidation, verifyToken_1.verifyToken, this.observationController.createObservation);
        this.router.post("/comment/:id", verifyToken_1.verifyToken, validator_1.memoValidationComment, this.observationController.createObservationComment);
        this.router.patch("/:id", verifyToken_1.verifyToken, (0, uploader_1.uploader)("IMG", "/image").single("image"), this.observationController.updateObservation);
        this.router.get("/", verifyToken_1.verifyToken, this.observationController.getObservations);
        this.router.get("/:userId", verifyToken_1.verifyToken, this.observationController.getObservationsByUserId);
        this.router.get("/:userId/:startDate/:endDate/:lecturer", verifyToken_1.verifyToken, this.observationController.getObservationsByUserIdByDate);
    }
    getRouter() {
        return this.router;
    }
}
exports.ObservationRouter = ObservationRouter;
