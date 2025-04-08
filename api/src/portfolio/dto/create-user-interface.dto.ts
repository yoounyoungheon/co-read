import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserInterfaceDto {
  @ApiProperty({
    example: 1,
    description: '인터페이스의 순서',
  })
  @Type(() => Number)
  @IsNumber()
  order: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    description: '업로드할 파일',
  })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiProperty({
    example: '이것은 사용자 인터페이스 설명입니다.',
    description: '설명',
  })
  @IsString()
  description: string;
}
