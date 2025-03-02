import { Profile } from 'src/portfolio/domain/profile/profile.domain';

export interface LoadProfileByIdPort {
  loadProfileById(id: string): Promise<Profile>;
}
