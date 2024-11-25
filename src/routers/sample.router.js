"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleRouter = void 0;
const express_1 = require("express");
const sample_controller_1 = require("../controllers/sample.controller");
const uploader_1 = require("../middleware/uploader");
class SampleRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.sampleController = new sample_controller_1.SampleController();
        this.init();
    }
    init() {
        this.router.get("/", this.sampleController.getSample);
        this.router.post("/", this.sampleController.createSample);
        this.router.post("/mail", this.sampleController.sendMail);
        this.router.post("/upload", (0, uploader_1.uploader)("IMG", "/image").single("gambar"), this.sampleController.addNewImage);
        this.router.post("/multiple-upload", (0, uploader_1.uploader)("IMG", "/image").array("gambar", 3), this.sampleController.addMultipleImage);
    }
    getRouter() {
        return this.router;
    }
}
exports.SampleRouter = SampleRouter;
