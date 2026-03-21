import { Product } from '../entity/product-entity';
import { User } from '../entity/user-entity';
import { BaseAppException } from '../error/base-app-exception';
import { DataSource, DataSourceOptions } from 'typeorm';

let appDataSource: DataSource | null = null;

function getEnvValue(names: string[], fallback?: string): string | undefined {
  for (const name of names) {
    const value = process.env[name];

    if (value) {
      return value;
    }
  }

  return fallback;
}

function getRequiredEnv(names: string[], fallback?: string): string {
  const value = getEnvValue(names, fallback);

  if (!value) {
    throw new BaseAppException(`Missing required environment variable: ${names.join(" or ")}`);
  }

  return value;
}

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
        host: getRequiredEnv(['DATABASE_HOST', 'DB_HOST'], 'localhost'),
        port: parseInt(getEnvValue(['DATABASE_PORT', 'DB_PORT'], '5432') ?? '5432', 10),
        username: getRequiredEnv(['DATABASE_USERNAME', 'DB_USER']),
        password: getRequiredEnv(['DATABASE_PASSWORD', 'DB_PASSWORD']),
        database: getRequiredEnv(['DATABASE_NAME', 'DB_NAME']),
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
