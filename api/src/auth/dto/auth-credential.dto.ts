import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({
    example: 'iddyoon@gmail.com',
    description: '회원가입시 사용자가 서비스에서 사용할 id',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  username: string;

  @ApiProperty({
    example: '사용자 이름',
    description: '회원가입시 사용자가 서비스에서 사용할 이름(id랑 다름)',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name: string;

  @ApiProperty({
    example: '!tbvjgjsl912',
    description: '회원가입시 사용자가 서비스에서 사용할 password',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  password: string;
}
