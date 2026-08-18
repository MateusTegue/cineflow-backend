import 'dotenv/config'
import { type DataSourceOptions } from 'typeorm'

interface ConfigDataBase {
  production: DataSourceOptions
  local: DataSourceOptions
}

export type ConfigEnv = keyof ConfigDataBase

const config: ConfigDataBase = {
  production: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: false,
    ssl:
      process.env.DB_ROOT_CA === undefined
        ? false
        : {
            ca: process.env.DB_ROOT_CA
          },
    logging: false,
    entities: ['build/database/entity/**/*.js'],
    migrations: ['build/database/migrations/*.js'],
    subscribers: []
  },

  local: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: ['error'],
    ssl: process.env.DB_SSL === 'true' ? { ca: process.env.DB_ROOT_CA } : false,
    entities: ['src/database/entity/**/*{.ts,.js}'],
    migrations: ['src/database/migrations/*{.ts,.js}'],
    subscribers: [],
    maxQueryExecutionTime: 1000
  }
}

export default config
