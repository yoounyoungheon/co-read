import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({
    example: ['안녕하세요.'],
    description: '한 줄 소개',
  })
  @IsArray()
  words: string[];

  @ApiProperty({
    example: '안녕하세요.',
    description: '소개 글',
  })
  @IsString()
  introdude: string;

  @ApiProperty({
    example: 'gir.com.',
    description: '깃허브 링크',
  })
  @IsString()
  gitUrl: string;

  @ApiProperty({
    example: 'blod.com',
    description: '블로그 링크',
  })
  @IsString()
  blogUrl: string;
}
