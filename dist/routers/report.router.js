"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRouter = void 0;
const express_1 = require("express");
const validator_1 = require("../middleware/validator");
const verifyToken_1 = require("../middleware/verifyToken");
const report_controller_1 = require("../controllers/report.controller");
const supabaseStorage_1 = require("../utils/supabaseStorage");
class ReportRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.reportController = new report_controller_1.ReportController();
        this.init();
    }
    init() {
        this.router.post("/", verifyToken_1.verifyToken, 
        // uploader("DOC", "/document").single("document"),
        supabaseStorage_1.handleUploadDoc, validator_1.reportValidation, this.reportController.createReport);
        this.router.patch("/:id", verifyToken_1.verifyToken, 
        // uploader("DOC", "/document").single("document"),
        // handleUploadDoc,
        validator_1.reportValidation, this.reportController.updateReport);
        this.router.get("/", verifyToken_1.verifyToken, this.reportController.getReports);
        this.router.get("/:userId", verifyToken_1.verifyToken, this.reportController.getReportsByUserId);
        this.router.get("/:userId/:startDate/:endDate/:lecturer", verifyToken_1.verifyToken, this.reportController.getReportsByUserIdByDate);
    }
    getRouter() {
        return this.router;
    }
}
exports.ReportRouter = ReportRouter;
