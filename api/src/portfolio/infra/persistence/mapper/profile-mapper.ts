import { Profile } from 'src/portfolio/domain/profile/profile.domain';
import { ProfileEntity } from '../entity/profile.entity';

export class ProfileMapper {
  static mapDomainToEntity(profile: Profile): ProfileEntity {
    return ProfileEntity.create(
      profile.userId,
      profile.introduce,
      profile.words,
      profile.gitUrl,
      profile.blogUrl,
    );
  }

  static mapEntityToDomain(profileEntity: ProfileEntity): Profile {
    return new Profile(
      profileEntity.id,
      profileEntity.userId,
      profileEntity.introduce,
      profileEntity.words,
      profileEntity.gitUrl,
      profileEntity.blogUrl,
    );
  }
}
