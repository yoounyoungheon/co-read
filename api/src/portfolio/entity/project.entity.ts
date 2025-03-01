import { BaseEntity } from 'src/utils/database/base-entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ProjectEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('jsonb', { nullable: true })
  userInterfaces: string[];

  @Column('jsonb', { nullable: true })
  beTechs: string[];

  @Column('jsonb', { nullable: true })
  feTechs: string[];

  @Column('jsonb', { nullable: true })
  infraTechs: string[];
}
