import { Profile } from 'src/portfolio/domain/profile/profile.domain';
import { ProfileEntity } from 'src/portfolio/infra/persistence/entity/profile.entity';

export interface UpdateProfilePort {
  updateProfile(peofile: Profile): Promise<ProfileEntity>;
}
