import "reflect-metadata";
import { container } from "tsyringe";
import { getAppDataSource } from "./config/database";
import { DataSource } from "typeorm";
import { UserRepository } from "./repository/user-repository";
import { Product } from "./entity/product-entity";
import { ProductRepository } from "./repository/product-repository";
import { UserService } from "./service/user-service";
import { ProductService } from "./service/product-service";
import { ICRUD } from "./types/ICRUD";

export async function registerDependencies(): Promise<void> {
    const dataSource = await getAppDataSource();

    container.register<DataSource>('AppDataSource', {
        useValue: dataSource,
    });

    container.register('UserRepository', { useClass: UserRepository });
    container.register('ProductRepository', { useClass: ProductRepository });
    container.register('UserServiceImpl', {
      useClass: UserService,
    });
    container.register<ICRUD<Product>>('ProductService', { useClass: ProductService });
}
