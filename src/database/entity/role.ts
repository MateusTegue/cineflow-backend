import { Entity, Column, OneToMany } from 'typeorm'
import { User } from './user' 
import { BaseAttributes } from '../../services'
import { role } from '../../utils/models'

@Entity('role')
export class Role extends BaseAttributes {
  @Column({
    type: 'enum',
    enum: role,
    unique: true,
  })
  name!: role

  @OneToMany(() => User, (user) => user.role)
  users!: User[]
}
