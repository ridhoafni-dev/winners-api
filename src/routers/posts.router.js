"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsRouter = void 0;
const express_1 = require("express");
const posts_controller_1 = require("../controllers/posts.controller");
class PostsRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.postController = new posts_controller_1.PostsController();
        this.init();
    }
    init() {
        this.router.get("/", this.postController.getPosts);
    }
    getRouter() {
        return this.router;
    }
}
exports.PostsRouter = PostsRouter;
