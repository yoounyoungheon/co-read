import { ApiProperty } from '@nestjs/swagger';
import { AggregateRoot } from 'src/utils/domain/aggregate-root';
import { TitleShouldNotEmpty } from './TitleShouldNotEmpty.rule';

export class Project extends AggregateRoot {
  @ApiProperty({
    example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
    description: 'id',
  })
  private readonly id: string;

  @ApiProperty({
    example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
    description: 'userId',
  })
  private userId: string;

  @ApiProperty({
    example: '알라숑프로젝트',
    description: 'project name',
  })
  private title: string;

  @ApiProperty({
    example: '알라숑프로젝트입니다.',
    description: 'project description',
  })
  private description: string;

  @ApiProperty({
    example: ['c6a99067-27d0-4358-b3d5-e63a64b604c0'],
    description: '사용자 화면 id',
  })
  private userInterfaces: string[];

  @ApiProperty({
    example: ['기술스택1', '기술스택2'],
    description: 'be tech stacks',
  })
  private feTechs: string[];

  @ApiProperty({
    example: ['기술스택1', '기술스택2'],
    description: 'fe tech stacks',
  })
  private beTechs: string[];

  @ApiProperty({
    example: ['기술스택1', '기술스택2'],
    description: 'infra tech stacks',
  })
  private infraTechs: string[];

  static create(userId: string, title: string) {
    return new Project(null, userId, title, '', [], [], [], []);
  }

  public updateTitle(title: string) {
    this.title = title;
  }

  public updateDescription(description: string) {
    this.description = description;
  }

  public updateBeTechs(Techs: string[]) {
    this.beTechs = Techs;
  }

  public updateFeTechs(Techs: string[]) {
    this.feTechs = Techs;
  }

  public updateInfraTechs(Techs: string[]) {
    this.infraTechs = Techs;
  }

  constructor(
    id: string,
    userId: string,
    title: string,
    description: string,
    userInterfaces: string[],
    beTechs: string[],
    feTechs: string[],
    infraTechs: string[],
  ) {
    super();
    this.checkRule(new TitleShouldNotEmpty(title));
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.userInterfaces = userInterfaces;
    this.beTechs = beTechs;
    this.feTechs = feTechs;
    this.infraTechs = infraTechs;
  }
}
