import { autoInjectable, inject } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user-service";
import { AuthError } from "../error/auth-error";
import { AuthedUser } from "../types/AuthedUser";
import jwt from "jsonwebtoken";
import { HttpStatus } from "../utils/http-status";
import ResponseTemplate from "../utils/response-template";
import { User } from "../entity/user-entity";
import { jwtExpirationTime, jwtSecrete } from "../utils/constants";

@autoInjectable()
export default class AuthController {
  constructor(
    @inject("UserServiceImpl")
    private readonly userService: UserService,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.body;
      const userCreated = await this.userService.save(user);

      res.status(HttpStatus.OK.code).send(
        new ResponseTemplate(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          HttpStatus.OK.description,
          userCreated,
        ),
      );
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await this.userService.login(email, password);

      if (!user) throw new AuthError("Unauthenticated");

      const token = jwt.sign(
        {
          sub: user.id,
          userName: user.username,
        } as AuthedUser,
        jwtSecrete,
        {
          expiresIn: jwtExpirationTime,
        },
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 3600000,
      });

      res.status(HttpStatus.OK.code).send(
        new ResponseTemplate(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          HttpStatus.OK.description,
          { token },
        ),
      );
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      res.status(HttpStatus.OK.code).send(
        new ResponseTemplate(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          "Logout successful",
          null,
        ),
      );
    } catch (error) {
      next(error);
    }
  };
}