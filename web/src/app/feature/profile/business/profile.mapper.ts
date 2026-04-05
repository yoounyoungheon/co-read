import { Profile, createProfileDomain } from "./profile.domain";
import { ProfileApiModel } from "./profile.api-model";

export const mapProfileApiModelToDomain = (
  profile: ProfileApiModel,
): Profile => {
  return createProfileDomain(
    profile.id,
    profile.userId,
    profile.introduce,
    profile.words,
    profile.gitUrl,
    profile.blogUrl,
  );
};
