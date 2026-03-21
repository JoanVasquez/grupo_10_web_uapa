import { Product } from "../entity/product-entity";
import { GenericService } from "./generic-service";
import { ProductRepository } from "../repository/product-repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class ProductService extends GenericService<Product> {
  constructor(@inject("ProductRepository") private readonly _: ProductRepository) {
    super(_, Product);
  }
}
