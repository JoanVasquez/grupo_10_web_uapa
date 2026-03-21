import { Product } from '../entity/product-entity';
import { User } from '../entity/user-entity';
import { BaseAppException } from '../error/base-app-exception';
import { DataSource, DataSourceOptions } from 'typeorm';

let appDataSource: DataSource | null = null;

export async function getAppDataSource(): Promise<DataSource> {
  if (appDataSource?.isInitialized) {
    return appDataSource;
  }

  let dataSourceOptions: DataSourceOptions;

  if (process.env.NODE_ENV === 'test') {
    dataSourceOptions = {
      type: 'sqlite',
      database: ':memory:',
      entities: [User, Product],
      synchronize: false,
    };
  } else {
    try {
      dataSourceOptions = {
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [User, Product],
        synchronize: true,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`❌ [Database] Failed to build configuration: ${error.message}`);
      }
      throw new BaseAppException('Database initialization failed.');
    }
  }

  try {
    appDataSource = new DataSource(dataSourceOptions);
    await appDataSource.initialize();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`❌ [Database] Connection failed: ${error.message}`);
    }
    throw new BaseAppException('Database connection failed');
  }

  return appDataSource;
}
