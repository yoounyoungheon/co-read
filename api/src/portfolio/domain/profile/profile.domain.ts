import { ApiProperty } from '@nestjs/swagger';
import { AggregateRoot } from 'src/utils/domain/aggregate-root';
import { IntroduceShouldNotEmpty } from './IntroduceShouldNotEmpty.rule';

export class Profile extends AggregateRoot {
  @ApiProperty({
    example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
    description: 'id',
  })
  readonly id: string;
  @ApiProperty({
    example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
    description: 'user id',
  })
  userId: string;
  @ApiProperty({
    example: '안녕하세요.',
    description: '한줄 소개',
  })
  introduce: string;
  @ApiProperty({
    example: ['c6a99067-27d0-4358-b3d5-e63a64b604c0'],
    description: '소개 줄글',
  })
  words: string[];
  @ApiProperty({
    example: 'www.example.com',
    description: 'git url',
  })
  gitUrl: string;
  @ApiProperty({
    example: 'www.example.com',
    description: 'blog url',
  })
  blogUrl: string;

  static create(userId: string, introduce: string) {
    return new Profile(null, userId, introduce, [], '', '');
  }

  public updateIntroduce(introduce: string) {
    this.introduce = introduce;
  }

  public updateWords(words: string[]) {
    this.words = words;
  }

  public updateGitUrl(gitUrl: string) {
    this.gitUrl = gitUrl;
  }

  public updateBlogUrl(blogUrl: string) {
    this.blogUrl = blogUrl;
  }

  constructor(
    id: string,
    userId: string,
    introduce: string,
    words: string[],
    gitUrl: string,
    blogUrl: string,
  ) {
    super();
    this.checkRule(new IntroduceShouldNotEmpty(introduce));
    this.id = id;
    this.userId = userId;
    this.introduce = introduce;
    this.words = words;
    this.gitUrl = gitUrl;
    this.blogUrl = blogUrl;
  }
}
