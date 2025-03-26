import { BaseEntity } from 'src/utils/database/base-entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ProfileEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  introduce: string;

  @Column('jsonb', { nullable: true })
  words: string[];

  @Column()
  gitUrl: string;

  @Column()
  blogUrl: string;

  static create(
    userId: string,
    introduce: string,
    words: string[],
    gitUrl: string,
    blogUrl: string,
  ): ProfileEntity {
    const profile = new ProfileEntity();
    profile.userId = userId;
    profile.introduce = introduce;
    profile.words = words;
    profile.gitUrl = gitUrl;
    profile.blogUrl = blogUrl;
    return profile;
  }
}
