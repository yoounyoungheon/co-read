import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: '프로젝트 제목',
    description: '프로젝트의 제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: ['이러한 프로젝트입니다.', '이러한 프로젝트입니다.'],
    description: '설명들',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value : String(value).split(','),
  )
  description: string[];

  @ApiProperty({
    example: [
      '이러한 문제가 있었고 고민했습니다.',
      '이러한 문제가 있었고 고민했습니다.',
    ],
    description: '고민한 내용',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value : String(value).split(','),
  )
  thinks: string[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '업로드할 파일',
  })
  @IsOptional()
  @IsString()
  imageUrl: string;

  @ApiProperty({
    example: ['Node.js', 'Express'],
    description: '백엔드 기술 스택',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value : String(value).split(','),
  )
  beTechs: string[];

  @ApiProperty({
    example: ['React', 'Redux'],
    description: '프론트엔드 기술 스택',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value : String(value).split(','),
  )
  feTechs: string[];

  @ApiProperty({
    example: ['AWS', 'Docker'],
    description: '인프라 기술 스택',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value : String(value).split(','),
  )
  infraTechs: string[];

  @ApiProperty({
    example: '2024-03-08T02:34:57.630Z',
    description: '시작 날짜',
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    example: '2024-03-08T02:34:57.630Z',
    description: '끝 날짜',
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
