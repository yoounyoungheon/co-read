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
    example: '프로젝트 설명',
    description: '프로젝트의 설명',
  })
  @IsString()
  description: string;

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
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  beTechs?: string[];

  @ApiProperty({
    example: ['React', 'Redux'],
    description: '프론트엔드 기술 스택',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  feTechs?: string[];

  @ApiProperty({
    example: ['AWS', 'Docker'],
    description: '인프라 기술 스택',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  infraTechs?: string[];

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
