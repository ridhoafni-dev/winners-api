"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoRouter = void 0;
const express_1 = require("express");
const validator_1 = require("../middleware/validator");
const memo_controller_1 = require("../controllers/memo.controller");
const verifyToken_1 = require("../middleware/verifyToken");
class MemoRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.memoController = new memo_controller_1.MemoController();
        this.init();
    }
    init() {
        this.router.post("/", validator_1.memoValidation, verifyToken_1.verifyToken, this.memoController.createMemo);
        this.router.post("/comment/:id", validator_1.memoValidationComment, verifyToken_1.verifyToken, this.memoController.createMemoComment);
        this.router.patch("/:id", validator_1.memoValidation, verifyToken_1.verifyToken, this.memoController.updateMemo);
        this.router.get("/", verifyToken_1.verifyToken, this.memoController.getMemos);
        this.router.get("/:userId", verifyToken_1.verifyToken, this.memoController.getMemosByUserId);
        this.router.get("/:userId/:startDate/:endDate/:lecturer", verifyToken_1.verifyToken, this.memoController.getMemosByUserIdByDate);
    }
    getRouter() {
        return this.router;
    }
}
exports.MemoRouter = MemoRouter;
