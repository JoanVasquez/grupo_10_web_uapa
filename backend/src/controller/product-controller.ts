import { autoInjectable, inject } from "tsyringe";
import BaseController from "./base-controller";
import { ICRUD } from "../types/ICRUD";
import { Product } from "../entity/product-entity";

@autoInjectable()
export default class ProductController extends BaseController<Product> {
  constructor(@inject("ProductService") protected productService: ICRUD<Product>) {
    super(productService);
  }
}
