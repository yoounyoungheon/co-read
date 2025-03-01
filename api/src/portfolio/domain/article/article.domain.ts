import { ApiProperty } from '@nestjs/swagger';
import { AggregateRoot } from 'src/utils/domain/aggregate-root';
import { TitleShouldNotEmpty } from '../project/TitleShouldNotEmpty.rule';

export class Article extends AggregateRoot {
  @ApiProperty({
    example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
    description: 'id',
  })
  private readonly id: string;
  @ApiProperty({
    example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
    description: 'user id',
  })
  private userId: string;
  @ApiProperty({
    example: '알라숑은 무엇인가',
    description: '아티클 제목',
  })
  private title: string;
  @ApiProperty({
    example: '알라숑에 대한 글입니다.',
    description: '아티클 설명',
  })
  private description: string;
  @ApiProperty({
    example: 'www.example.com',
    description: 'article url',
  })
  private url: string;

  static create(
    userId: string,
    title: string,
    description: string,
    url: string,
  ) {
    return new Article(null, userId, title, description, url);
  }

  public updateTitle(title: string) {
    this.title = title;
  }

  public updateDescription(description: string) {
    this.description = description;
  }

  public upadteUrl(url: string) {
    this.url = url;
  }

  constructor(
    id: string,
    userId: string,
    title: string,
    description: string,
    url: string,
  ) {
    super();
    this.checkRule(new TitleShouldNotEmpty(title));
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.url = url;
  }
}
