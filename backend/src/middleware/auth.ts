import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { AuthError } from "../error/auth-error";
import { AuthedUser } from "../types/AuthedUser";
import { jwtSecrete } from "../utils/constants";

declare global {
  namespace Express {
    interface Request {
      token?: string;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);
  const jwtSecret = jwtSecrete;

  try {
    if (!token) {
      throw new AuthError("Unauthorized: No token provided");
    }

    const decoded = jwt.verify(token, jwtSecret) as AuthedUser;

    if (typeof decoded !== "object" || !("sub" in decoded)) {
      throw new AuthError("Invalid token structure");
    }

    next();
  } catch (error) {
    if (
      error instanceof TokenExpiredError ||
      error instanceof JsonWebTokenError ||
      error instanceof NotBeforeError
    ) {
      next(new AuthError("Unauthorized: Invalid or expired token"));
      return;
    }

    next(error);
  }
};
