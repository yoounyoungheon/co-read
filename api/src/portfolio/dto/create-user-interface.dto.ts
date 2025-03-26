import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateUserInterfaceDto {
  @ApiProperty({
    example: 1,
    description: '인터페이스의 순서',
  })
  @IsNumber()
  order: number;

  @ApiProperty({
    example: 'https://example.com/file.png',
    description: '파일 URL',
  })
  @IsString()
  fileUrl: string;

  @ApiProperty({
    example: '이것은 사용자 인터페이스 설명입니다.',
    description: '설명',
  })
  @IsString()
  description: string;
}
