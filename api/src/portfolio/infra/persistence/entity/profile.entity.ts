import { BaseEntity } from 'src/utils/database/base-entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ProfileEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('jsonb', { nullable: true })
  words: string[];

  @Column()
  gitUrl: string;

  @Column()
  blogUrl: string;
}
