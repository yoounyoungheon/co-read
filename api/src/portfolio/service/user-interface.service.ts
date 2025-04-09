import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInterfaceEntity } from '../entity/user-interface.entity';
import { CreateUserInterfaceDto } from '../dto/create-user-interface.dto';
import { ProjectEntity } from '../entity/project.entity';
import { Transactional } from 'typeorm-transactional';
import { S3Service } from './s3.service';

@Injectable()
export class UserInterfaceService {
  constructor(
    @InjectRepository(UserInterfaceEntity)
    private userInterfaceRepository: Repository<UserInterfaceEntity>,
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    private readonly s3Service: S3Service,
  ) {}

  @Transactional()
  async createUserInterface(
    projectId: string,
    createUserInterfaceDto: CreateUserInterfaceDto,
  ): Promise<UserInterfaceEntity> {
    const { order, fileUrl, description } = createUserInterfaceDto;
    console.log(projectId);
    const project = await this.projectRepository.findOneBy({ id: projectId });

    const newUserInterface = this.userInterfaceRepository.create({
      project,
      order,
      fileUrl,
      description,
    });
    return await this.userInterfaceRepository.save(newUserInterface);
  }

  @Transactional()
  async getUserInterfaceById(
    id: string,
  ): Promise<UserInterfaceEntity | undefined> {
    const userInterface = await this.userInterfaceRepository.findOneBy({ id });
    if (!userInterface) {
      return undefined;
    }
    userInterface.fileUrl = await this.s3Service.getFileDownloadUrls(
      userInterface.fileUrl,
    );
    return userInterface;
  }

  @Transactional()
  async getUserInterfacesByProjectId(
    projectId: string,
  ): Promise<UserInterfaceEntity[]> {
    const userInterfaces = await this.userInterfaceRepository.find({
      where: { project: { id: projectId } },
    });

    for (const userInterface of userInterfaces) {
      userInterface.fileUrl = await this.s3Service.getFileDownloadUrls(
        userInterface.fileUrl,
      );
    }

    return userInterfaces;
  }

  @Transactional()
  async deleteUserInterface(id: string): Promise<void> {
    await this.userInterfaceRepository.delete(id);
  }
}
