import { Profile } from 'src/portfolio/domain/profile/profile.domain';

export interface LoadProfilesByUserPort {
  loadProfilesByUser(userId: string): Promise<Profile[]>;
}
