import { BaseEntity } from 'src/utils/database/base-entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity()
export class UserInterfaceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProjectEntity)
  project: ProjectEntity;

  @Column()
  order: number;

  @Column()
  fileUrl: string;

  @Column()
  description: string;
}
