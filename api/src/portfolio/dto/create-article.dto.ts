import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    example: 'Article Title',
    description: 'The title of the article',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'This is a description of the article.',
    description: 'The description of the article',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'https://example.com/article',
    description: 'The URL of the article',
  })
  @IsString()
  url: string;
}
