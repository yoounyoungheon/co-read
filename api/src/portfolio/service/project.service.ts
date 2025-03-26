import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../entity/project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UserInterfaceEntity } from '../entity/user-interface.entity';
import { UserInterfaceService } from './user-interface.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @InjectRepository(UserInterfaceEntity)
    private userInterfaceRepository: Repository<UserInterfaceEntity>,
    private userInterfaceService: UserInterfaceService,
  ) {}

  @Transactional()
  async createProject(
    userId: string,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectEntity> {
    const { title, description, beTechs, feTechs, infraTechs } =
      createProjectDto;
    const newProject = this.projectRepository.create({
      userId,
      title,
      description,
      beTechs,
      feTechs,
      infraTechs,
    });
    return await this.projectRepository.save(newProject);
  }

  @Transactional()
  async getProjectById(id: string): Promise<ProjectEntity | undefined> {
    return await this.projectRepository.findOneBy({ id });
  }

  @Transactional()
  async getProjects(): Promise<ProjectEntity[]> {
    return await this.projectRepository.find();
  }

  @Transactional()
  async deleteProject(id: string): Promise<void> {
    const userInterfaceEntities =
      await this.userInterfaceService.getUserInterfacesByProjectId(id);

    await this.userInterfaceRepository.remove(userInterfaceEntities);
    await this.projectRepository.delete(id);
  }
}
