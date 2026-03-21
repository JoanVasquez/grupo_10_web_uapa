import { Router, Request, Response, NextFunction } from "express";
import { validateRequest } from "../middleware/validate-request";
import { authenticateToken } from "../middleware/auth";
import ProductController from "../controller/product-controller";
import { container } from "tsyringe";
import { paginationValidation, productValidation } from "../utils/constants";

const router: Router = Router();

router.post("/product", productValidation, validateRequest, authenticateToken, (req: Request, res: Response, next: NextFunction) =>
  container.resolve(ProductController).save!(req, res, next),
);
router.get("/product/:id", authenticateToken, (req: Request, res: Response, next: NextFunction) =>
  container.resolve(ProductController).findById!(req, res, next),
);
router.put("/product/:id", authenticateToken, productValidation, validateRequest, (req: Request, res: Response, next: NextFunction) =>
  container.resolve(ProductController).update!(req, res, next),
);
router.get("/product", authenticateToken, paginationValidation, validateRequest, (req: Request, res: Response, next: NextFunction) =>
  container.resolve(ProductController).findAll!(req, res, next),
);
router.delete("/product/:id", authenticateToken, (req: Request, res: Response, next: NextFunction) =>
  container.resolve(ProductController).delete!(req, res, next),
);

export { router as productRoutes };
