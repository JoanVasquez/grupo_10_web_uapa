import { NextFunction, Request, Response } from "express";
import { ICRUD } from "../types/ICRUD";
import { HttpStatus } from "../utils/http-status";
import ResponseTemplate from "../utils/response-template";

export default abstract class BaseController<T> {
  constructor(protected readonly baseService: ICRUD<T>) { }

  save? = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const entityCreated = await this.baseService.save(req.body);
      console.log('TEEEEEEEEEEEEEEEEE3EEEEST')
      res
        .status(HttpStatus.CREATED.code)
        .send(
          new ResponseTemplate(
            HttpStatus.CREATED.code,
            HttpStatus.CREATED.status,
            HttpStatus.CREATED.description,
            entityCreated,
          ),
        );
    } catch (error) {
      next(error);
    }
  };

  update? = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id: string = req.params.id;
      const updatedEntity = await this.baseService.update(id, req.body);

      res
        .status(HttpStatus.OK.code)
        .send(
          new ResponseTemplate(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            HttpStatus.OK.description,
            updatedEntity,
          ),
        );
    } catch (error) {
      next(error);
    }
  };

  delete? = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id: string = req.params.id;
      const isDeleted = await this.baseService.delete(id);

      res
        .status(HttpStatus.OK.code)
        .send(
          new ResponseTemplate(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            HttpStatus.OK.description,
            isDeleted,
          ),
        );
    } catch (error) {
      next(error);
    }
  };

  findById? = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id: string = req.params.id;
      const entity = await this.baseService.findById(id);

      res
        .status(HttpStatus.OK.code)
        .send(
          new ResponseTemplate(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            HttpStatus.OK.description,
            entity,
          ),
        );
    } catch (error) {
      next(error);
    }
  };

  findAll? = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const perPage = parseInt(req.query.per_page as string, 10) || 10;
      const entities = await this.baseService.findAll(page, perPage);

      res
        .status(HttpStatus.OK.code)
        .send(
          new ResponseTemplate(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            HttpStatus.OK.description,
            entities,
          ),
        );
    } catch (error) {
      next(error);
    }
  };
}
