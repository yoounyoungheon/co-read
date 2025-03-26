import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserInterfaceService } from '../service/user-interface.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserInterfaceDto } from '../dto/create-user-interface.dto';
import { UserInterfaceEntity } from '../entity/user-interface.entity';

@ApiTags('User Interface Controller')
@Controller('/user-interface')
export class UserInterfaceController {
  constructor(private userInterfaceService: UserInterfaceService) {}

  @ApiOperation({ summary: '사용자 인터페이스를 생성합니다.' })
  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  async createUserInterface(
    @Body() createUserInterfaceDto: CreateUserInterfaceDto,
    @Param('projectId') projectId: string,
  ): Promise<UserInterfaceEntity> {
    return this.userInterfaceService.createUserInterface(
      projectId,
      createUserInterfaceDto,
    );
  }

  @ApiOperation({ summary: 'ID로 사용자 인터페이스를 가져옵니다.' })
  @Get(':id')
  async getUserInterfaceById(
    @Param('id') id: string,
  ): Promise<UserInterfaceEntity | undefined> {
    return this.userInterfaceService.getUserInterfaceById(id);
  }

  @ApiOperation({
    summary: '프로젝트 ID로 모든 사용자 인터페이스를 가져옵니다.',
  })
  @Get('/project/:projectId')
  async getUserInterfacesByProjectId(
    @Param('projectId') projectId: string,
  ): Promise<UserInterfaceEntity[]> {
    return this.userInterfaceService.getUserInterfacesByProjectId(projectId);
  }

  @ApiOperation({ summary: 'ID로 사용자 인터페이스를 삭제합니다.' })
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  async deleteUserInterface(@Param('id') id: string): Promise<void> {
    return this.userInterfaceService.deleteUserInterface(id);
  }
}
