import { Router } from "express";
import { PostsController } from "../controllers/posts.controller";

export class PostsRouter {
  private router: Router;
  private postController: PostsController;

  constructor() {
    this.router = Router();
    this.postController = new PostsController();
    this.init();
  }

  init() {
    this.router.get("/", this.postController.getPosts);
  }

  getRouter(): Router {
    return this.router;
  }
}
