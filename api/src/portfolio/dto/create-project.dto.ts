import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

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
    example: ['Node.js', 'Express'],
    description: '백엔드 기술 스택',
    required: false,
  })
  @IsArray()
  @IsOptional()
  beTechs?: string[];

  @ApiProperty({
    example: ['React', 'Redux'],
    description: '프론트엔드 기술 스택',
    required: false,
  })
  @IsArray()
  @IsOptional()
  feTechs?: string[];

  @ApiProperty({
    example: ['AWS', 'Docker'],
    description: '인프라 기술 스택',
    required: false,
  })
  @IsArray()
  @IsOptional()
  infraTechs?: string[];
}
