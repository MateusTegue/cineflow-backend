import 'reflect-metadata'
import { DataSource } from 'typeorm'
import config, { type ConfigEnv } from './config'

export const AppDataSource = new DataSource(
  config[(process.env.ENV as ConfigEnv) ?? 'local']
)
