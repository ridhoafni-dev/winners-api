import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { loginValidation, regisValidation } from "../middleware/validator";
import { verifyToken } from "../middleware/verifyToken";

export class AuthRouters {
  private router: Router;
  private authController: AuthController;
  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.init();
  }

  private init() {
    this.router.post(
      "/register",
      regisValidation,
      this.authController.registerUser
    );
    this.router.post("/login", loginValidation, this.authController.loginUser);
    this.router.get("/lecturers", this.authController.getLecturers);
    this.router.get(
      "/users/:startDate/:endDate/:role",
      this.authController.getUsersByRoleByDate
    );
    this.router.post("/forgotPassword", this.authController.forgotPassword);
    this.router.post("reset", verifyToken, this.authController.resetPassword);
    this.router.put(
      "/user/updateUserStatus/:id",
      verifyToken,
      this.authController.updateUserStatus
    );
  }

  getRouter() {
    return this.router;
  }
}
