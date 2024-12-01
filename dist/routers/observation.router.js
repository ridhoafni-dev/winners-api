"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservationRouter = void 0;
const express_1 = require("express");
const validator_1 = require("../middleware/validator");
const observation_controller_1 = require("../controllers/observation.controller");
const verifyToken_1 = require("../middleware/verifyToken");
const supabaseStorage_1 = require("../utils/supabaseStorage");
class ObservationRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.observationController = new observation_controller_1.ObservationController();
        this.init();
    }
    init() {
        this.router.post("/", 
        //uploader("IMG", "/image").single("image"),
        verifyToken_1.verifyToken, supabaseStorage_1.handleUpload, validator_1.observationValidation, this.observationController.createObservation);
        this.router.post("/comment/:id", verifyToken_1.verifyToken, validator_1.memoValidationComment, this.observationController.createObservationComment);
        this.router.patch("/:id", supabaseStorage_1.handleUpload, verifyToken_1.verifyToken, 
        // uploader("IMG", "/image").single("image"),
        this.observationController.updateObservation);
        this.router.get("/", verifyToken_1.verifyToken, this.observationController.getObservations);
        this.router.get("/:userId", verifyToken_1.verifyToken, this.observationController.getObservationsByUserId);
        this.router.get("/:userId/:startDate/:endDate/:lecturer", verifyToken_1.verifyToken, this.observationController.getObservationsByUserIdByDate);
    }
    getRouter() {
        return this.router;
    }
}
exports.ObservationRouter = ObservationRouter;
