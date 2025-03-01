import { BaseEntity } from 'src/utils/database/base-entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserInterfaceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  projectId: string;

  @Column()
  fileUrl: string;

  @Column()
  description: string;
}
