/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  type Repository,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  type FindOptionsWhere,
  type FindOptionsSelect,
  type FindOptionsSelectByString,
  type ObjectLiteral
} from 'typeorm'
import { NotFoundError } from '../helpers/exceptions-errors'
import { type QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export abstract class BaseAttributes {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}

export interface IService<T extends ObjectLiteral> {
  create: (
    body: QueryDeepPartialEntity<T> | Array<QueryDeepPartialEntity<T>>
  ) => Promise<ObjectLiteral[]>
  getAll: () => Promise<T[]>
  getOne: (
    where: FindOptionsWhere<T>,
    message: string,
    selectOptions:
      | FindOptionsSelect<T>
      | FindOptionsSelectByString<T>
      | undefined
  ) => Promise<T>
}

export default class Service<T extends ObjectLiteral, R extends Repository<T>>
  implements IService<T>
{
  protected repository: R
  constructor(repository: R) {
    this.repository = repository
  }

  /*
   * -----------------------------------------------------------------------
   * Crea un nuevo registro de una entidad
   *
   * -----------------------------------------------------------------------
   */
  async create(
    body: QueryDeepPartialEntity<T> | Array<QueryDeepPartialEntity<T>>
  ): Promise<ObjectLiteral[]> {
    const data = await this.repository.insert(body)
    return data.generatedMaps
  }

  /*
   * -----------------------------------------------------------------------
   * Obtiene un array de resultados con todos los registros del modelo
   *
   * -----------------------------------------------------------------------
   */
  async getAll(
    selectOptions:
      | FindOptionsSelect<T>
      | FindOptionsSelectByString<T>
      | undefined = undefined
  ): Promise<T[]> {
    return await this.repository.find({ select: selectOptions })
  }

  /*
   * -----------------------------------------------------------------------
   * Obtiene los resultados de un modelo específico según su UUID
   *
   * -----------------------------------------------------------------------
   */

  async getOne(
    where: FindOptionsWhere<T>,
    message: string,
    selectOptions:
      | FindOptionsSelect<T>
      | FindOptionsSelectByString<T>
      | undefined = undefined
  ): Promise<T> {
    const data = await this.repository.findOne({ where, select: selectOptions })

    // Valida si la data existe
    if (data === null) {
      throw new NotFoundError(message)
    }
    return data
  }
}



// import {
//   type Repository,
//   PrimaryGeneratedColumn,
//   CreateDateColumn,
//   UpdateDateColumn,
//   type FindOptionsWhere,
//   type FindOptionsSelect,
//   type ObjectLiteral
// } from 'typeorm'
// import { NotFoundError } from '../helpers/exceptions-errors'
// import { type QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

// export abstract class BaseAttributes {
//   @PrimaryGeneratedColumn('uuid')
//   id!: string

//   @CreateDateColumn()
//   created_at!: Date

//   @UpdateDateColumn()
//   updated_at!: Date
// }

// export interface IService<T extends ObjectLiteral> {
//   create: (
//     body: QueryDeepPartialEntity<T> | Array<QueryDeepPartialEntity<T>>
//   ) => Promise<ObjectLiteral[]>

//   getAll: (
//     selectOptions?: FindOptionsSelect<T>
//   ) => Promise<T[]>

//   getOne: (
//     where: FindOptionsWhere<T>,
//     message: string,
//     selectOptions?: FindOptionsSelect<T>
//   ) => Promise<T>
// }

// export default class Service<T extends ObjectLiteral, R extends Repository<T>>
//   implements IService<T>
// {
//   protected repository: R

//   constructor(repository: R) {
//     this.repository = repository
//   }

//   async create(
//     body: QueryDeepPartialEntity<T> | Array<QueryDeepPartialEntity<T>>
//   ): Promise<ObjectLiteral[]> {
//     const data = await this.repository.insert(body)
//     return data.generatedMaps
//   }

//   async getAll(selectOptions?: FindOptionsSelect<T>): Promise<T[]> {
//     return await this.repository.find({
//       select: selectOptions
//     })
//   }

//   async getOne(
//     where: FindOptionsWhere<T>,
//     message: string,
//     selectOptions?: FindOptionsSelect<T>
//   ): Promise<T> {
//     const data = await this.repository.findOne({
//       where,
//       select: selectOptions
//     })

//     if (data === null) {
//       throw new NotFoundError(message)
//     }

//     return data
//   }
// }
