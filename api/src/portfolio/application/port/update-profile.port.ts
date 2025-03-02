import { Profile } from 'src/portfolio/domain/profile/profile.domain';

export interface UpdateProfilePort {
  updateProfile(
    introduce: string,
    words: string[],
    gitUrl: string,
    blogUrl: string,
  ): Promise<Profile>;
}
