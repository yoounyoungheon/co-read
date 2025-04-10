import { Injectable, NotFoundException } from '@nestjs/common';
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
  async getProfileForGuest(): Promise<ProfileEntity | undefined> {
    const profiles = await this.profileRepository.find();
    if (profiles.length === 0) {
      throw new NotFoundException('프로필이 없습니다.');
    }
    return profiles[0];
  }

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
