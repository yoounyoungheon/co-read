import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInterfaceEntity } from '../entity/user-interface.entity';
import { CreateUserInterfaceDto } from '../dto/create-user-interface.dto';
import { ProjectEntity } from '../entity/project.entity';

@Injectable()
export class UserInterfaceService {
  constructor(
    @InjectRepository(UserInterfaceEntity)
    private userInterfaceRepository: Repository<UserInterfaceEntity>,
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) {}

  async createUserInterface(
    projectId: string,
    createUserInterfaceDto: CreateUserInterfaceDto,
  ): Promise<UserInterfaceEntity> {
    const { order, fileUrl, description } = createUserInterfaceDto;
    const project = await this.projectRepository.findOneBy({ id: projectId });

    const newUserInterface = this.userInterfaceRepository.create({
      project,
      order,
      fileUrl,
      description,
    });
    return await this.userInterfaceRepository.save(newUserInterface);
  }

  async getUserInterfaceById(
    id: string,
  ): Promise<UserInterfaceEntity | undefined> {
    return await this.userInterfaceRepository.findOneBy({ id });
  }

  async getUserInterfacesByProjectId(
    projectId: string,
  ): Promise<UserInterfaceEntity[]> {
    return await this.userInterfaceRepository.find({
      where: { project: { id: projectId } },
    });
  }

  async deleteUserInterface(id: string): Promise<void> {
    await this.userInterfaceRepository.delete(id);
  }
}
