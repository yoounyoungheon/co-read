import { Entity, PrimaryGeneratedColumn, BaseEntity, Column } from 'typeorm';

@Entity()
export class MemberEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  memberId: string;

  @Column()
  email: string;

  @Column()
  memberName: string;

  @Column()
  password: string;
}
