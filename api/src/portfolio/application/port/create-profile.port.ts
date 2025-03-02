import { Profile } from 'src/portfolio/domain/profile/profile.domain';

export interface CreateProfilePort {
  createProfile(
    userId: string,
    introduce: string,
    words: string[],
    gitUrl: string,
    blogUrl: string,
  ): Promise<Profile>;
}
