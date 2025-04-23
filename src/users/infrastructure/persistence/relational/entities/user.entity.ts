import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { RoleEntity } from '../../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { StatusEntity } from '../../../../../statuses/infrastructure/persistence/relational/entities/status.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { GenderEnum } from '../../../../enums/gender.enum';

import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'user',
})
export class UserEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid') // Cambiado a UUID
  id: string; // Cambiado a string

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @Column({ type: String, unique: true, nullable: false })
  username: string;

  @Column({ nullable: true })
  password?: string;

  @Index()
  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  lastName: string | null;

  @Column({ type: 'date', nullable: true })
  birthDate: Date | null;

  @Column({ type: 'enum', enum: GenderEnum, nullable: true })
  gender: GenderEnum | null;

  @Column({ type: String, nullable: true })
  phoneNumber: string | null;

  @Column({ type: String, nullable: true })
  address: string | null;

  @Column({ type: String, nullable: true })
  city: string | null;

  @Column({ type: String, nullable: true })
  state: string | null;

  @Column({ type: String, nullable: true })
  country: string | null;

  @Column({ type: String, nullable: true })
  zipCode: string | null;

  @Column({ type: 'jsonb', nullable: true })
  emergencyContact: Record<string, any> | null;

  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  photo?: FileEntity | null;

  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  role?: RoleEntity | null;

  @ManyToOne(() => StatusEntity, {
    eager: true,
  })
  status?: StatusEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
