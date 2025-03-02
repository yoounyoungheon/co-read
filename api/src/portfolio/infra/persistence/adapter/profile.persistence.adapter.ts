import { InjectRepository } from '@nestjs/typeorm';
import { CreateProfilePort } from 'src/portfolio/application/port/create-profile.port';
import { DeleteProfilePort } from 'src/portfolio/application/port/delete-profile.port';
import { LoadProfileByIdPort } from 'src/portfolio/application/port/load-profile-by-id.port';
import { LoadProfilesByUserPort } from 'src/portfolio/application/port/load-profiles-by-user.port';
import { UpdateProfilePort } from 'src/portfolio/application/port/update-profile.port';
import { ProfileEntity } from '../entity/profile.entity';
import { Repository } from 'typeorm';
import { MemberEntity } from 'src/auth/member/member.entity';
import { Profile } from 'src/portfolio/domain/profile/profile.domain';
import { ProfileMapper } from '../mapper/profile-mapper';

export class ProfilePersistenceAdapter
  implements
    CreateProfilePort,
    LoadProfileByIdPort,
    LoadProfilesByUserPort,
    UpdateProfilePort,
    DeleteProfilePort
{
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}

  async createProfile(profile: Profile): Promise<ProfileEntity> {
    return await this.profileRepository.save(
      ProfileMapper.mapDomainToEntity(profile),
    );
  }

  async loadProfileById(id: string): Promise<Profile> {
    const entity = await this.profileRepository.findOneBy({ id });
    return ProfileMapper.mapEntityToDomain(entity);
  }

  async loadProfilesByUser(userId: string): Promise<Profile[]> {
    const entities = await this.profileRepository.findBy({ userId });
    return entities.map(ProfileMapper.mapEntityToDomain);
  }

  async updateProfile(profile: Profile): Promise<ProfileEntity> {
    return await this.profileRepository.save(profile);
  }

  async deleteProfile(id: string): Promise<void> {
    await this.profileRepository.delete(id);
  }
}
