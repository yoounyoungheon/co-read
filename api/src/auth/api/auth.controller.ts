import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { AuthCredentialsDto } from '../dto/auth-credential.dto';
import { AuthLoginRequestDto } from '../dto/auth-login-request.dto';
import { AuthLogInResponseDto } from '../dto/auth-login-response.dto';

@ApiTags('Auth Controller')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '회원가입을 합니다.' })
  @Post('/sign-up')
  async signUp(@Body() authCredentialDto: AuthCredentialsDto): Promise<string> {
    return await this.authService.signUp(authCredentialDto);
  }

  @ApiOperation({ summary: '로그인을 합니다.' })
  @Post('sign-in')
  async signIn(
    @Body(ValidationPipe) authLoginRequestDto: AuthLoginRequestDto,
  ): Promise<AuthLogInResponseDto> {
    return await this.authService.signIn(authLoginRequestDto);
  }

  @Post('/authTest')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  authTest(@Req() req) {
    console.log(req.user.memberId);
  }

  @Get('/')
  getAuthTest(): string {
    console.log('test');
    return 'test Success';
  }
}
