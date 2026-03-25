import { Router, Request, Response, NextFunction } from "express";
import { validateRequest } from "../middleware/validate-request";
import { container } from "tsyringe";
import AuthController from "../controller/auth-controller";
import { userLoginValidation, userRegistrationValidation } from "../utils/constants";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post(
  "/register",
  userRegistrationValidation,
  validateRequest,
  (req: Request, res: Response, next: NextFunction) =>
    container.resolve(AuthController).register(req, res, next),
);
router.post(
  "/login",
  userLoginValidation,
  validateRequest,
  (req: Request, res: Response, next: NextFunction) =>
    container.resolve(AuthController).login(req, res, next),
);
router.get("/logout", authenticateToken, (req: Request, res: Response, next: NextFunction) =>
  container.resolve(AuthController).logout(req, res, next),
);

export { router as authRoutes };
