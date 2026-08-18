import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseAttributes } from '../../services'
import { status } from '../../utils/models'
import { Role } from './role'

@Entity('user')
export class User extends BaseAttributes {
  @Column({ type: 'varchar', nullable: false })
  firstName!: string

  @Column({ type: 'varchar', nullable: false })
  firstMiddleName!: string

  @Column({ type: 'varchar', unique: true, nullable: false })
  email!: string

  @Column({ type: 'varchar', nullable: false })
  codePhone!: string

  @Column({ type: 'varchar', unique: true, nullable: false })
  phone!: string

  @Column({ type: 'varchar', unique: true, nullable: false })
  username!: string

  @Column({ type: 'varchar', nullable: false })
  password!: string

  @Column({
    type: 'enum',
    enum: status,
    default: status.ACTIVE,
  })
  status!: status

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role!: Role
}
