import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileService } from '../service/profile.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { ProfileEntity } from '../entity/profile.entity';
import { MemberEntity } from 'src/auth/member/member.entity';
import { Member } from 'src/utils/decorater/get-member.decorator';

@ApiTags('Profile Controller')
@Controller('/profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @ApiOperation({ summary: '프로필을 생성합니다.' })
  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  async createProfile(
    @Body() createProfileDto: CreateProfileDto,
    @Member() member: MemberEntity,
  ): Promise<ProfileEntity> {
    return this.profileService.createProfile(member.memberId, createProfileDto);
  }

  @ApiOperation({ summary: '사용자의 프로필을 가져옵니다.' })
  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  async loadProfile(@Member() member: MemberEntity): Promise<ProfileEntity> {
    return this.profileService.getProfileByUserId(member.memberId);
  }

  @ApiOperation({ summary: '게스트가 사용자의 프로필을 가져옵니다.' })
  @Get('/guest')
  async loadProfileForGuest() {
    return this.profileService.getProfileForGuest();
  }

  @ApiOperation({ summary: '사용자의 프로필을 삭제합니다.' })
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  async deleteProfile(@Param('id') id: string): Promise<void> {
    return this.profileService.deleteProfile(id);
  }
}
