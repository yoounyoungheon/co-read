import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';
import { ProjectService } from '../service/project.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectEntity } from '../entity/project.entity';
import { MemberEntity } from 'src/auth/member/member.entity';
import { Member } from 'src/utils/decorater/get-member.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../service/s3.service';

@ApiTags('Project Controller')
@Controller('/project')
export class ProjectController {
  constructor(
    private projectService: ProjectService,
    private readonly s3Service: S3Service,
  ) {}

  @ApiOperation({ summary: '프로젝트를 생성합니다.' })
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('imageUrl'))
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFile() imageUrl: Express.Multer.File,
    @Member() member: MemberEntity,
  ): Promise<ProjectEntity> {
    const fileExtension = imageUrl.originalname.split('.').pop();
    const fileName = `${Date.now()}-${imageUrl.originalname}`;

    const uploadedFileUrl = await this.s3Service.uploadFile(
      fileName,
      imageUrl,
      fileExtension,
    );
    createProjectDto.imageUrl = uploadedFileUrl;
    return this.projectService.createProject(member.memberId, createProjectDto);
  }

  @ApiOperation({ summary: 'ID로 프로젝트를 가져옵니다.' })
  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<ProjectEntity> {
    return this.projectService.getProjectById(id);
  }

  @ApiOperation({ summary: '모든 프로젝트를 가져옵니다.' })
  @Get()
  async getProjects(): Promise<ProjectEntity[]> {
    return this.projectService.getProjects();
  }

  @ApiOperation({ summary: 'ID로 프로젝트를 삭제합니다.' })
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  async deleteProject(@Param('id') id: string): Promise<void> {
    return this.projectService.deleteProject(id);
  }
}
