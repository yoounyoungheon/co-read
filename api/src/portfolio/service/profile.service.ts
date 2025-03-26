import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../entity/profile.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
  ) {}

  @Transactional()
  async createProfile(
    userId: string,
    dto: CreateProfileDto,
  ): Promise<ProfileEntity> {
    const { introdude, words, gitUrl, blogUrl } = dto;
    const newProfile = ProfileEntity.create(
      userId,
      introdude,
      words,
      gitUrl,
      blogUrl,
    );
    return await this.profileRepository.save(newProfile);
  }

  @Transactional()
  async deleteProfile(id: string): Promise<void> {
    await this.profileRepository.delete(id);
  }

  @Transactional()
  async getProfileByUserId(userId: string): Promise<ProfileEntity | undefined> {
    return await this.profileRepository.findOneBy({ userId });
  }
}
