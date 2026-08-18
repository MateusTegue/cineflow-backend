import { DeepPartial } from 'typeorm';
import { AppDataSource } from '../../database/data-source'
import { User } from '../../database/entity/user';
import { Role } from '../../database/entity/role';
import { ConflictError, ServerError } from '../../helpers/exceptions-errors';

export const UserRepository = AppDataSource.getRepository(User).extend({
    async createUser(body: DeepPartial<User>, roleId: string) {
        try {
          const role = await AppDataSource.getRepository(Role).findOneBy({ id: roleId })
        if (!role) {
          throw new Error(`Role con id ${roleId} no existe`)
        }
        const existing = await this.findOne({
          where: [{ email: body.email }, { username: body.username }],
        });

        if (existing) {
          throw new ConflictError(`El email ${body.email} ya está en uso`, { email: body.email })
        }

        const user = this.create({
          ...body,
          role,
        })

        return await this.save(user);

      } catch (error) {

        throw new ServerError('Error al crear el usuario', { cause: error })
      }
    }
});
