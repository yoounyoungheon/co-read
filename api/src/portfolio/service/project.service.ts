import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../entity/project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) {}

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

  async getProjectById(id: string): Promise<ProjectEntity | undefined> {
    return await this.projectRepository.findOneBy({ id });
  }

  async getProjects(): Promise<ProjectEntity[]> {
    return await this.projectRepository.find();
  }

  async deleteProject(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
