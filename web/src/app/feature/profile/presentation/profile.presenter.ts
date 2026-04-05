import type { Profile } from "../business/profile.domain";
import type { ProfileViewModel } from "./profile.view-model";

export const presentProfile = (profile: Profile): ProfileViewModel => {
  return {
    name: "윤영헌",
    job: "🖥️ developer",
    spec: profile.words,
    introduction: `${profile.introduce}\ne-mail: iddyoon@gmail.com`,
    profileImage: "/images/profile.png",
    githubLink: profile.gitUrl,
    blogLink: profile.blogUrl,
  };
};
