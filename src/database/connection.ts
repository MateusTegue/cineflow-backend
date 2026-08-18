import { AppDataSource } from './data-source'

export const initDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize()
    console.log('PostgreSQL Database connected')
  } catch (e) {
    console.error('PostgreSQL Database error', e)
  }
}

export default AppDataSource
