import type { StaticImageData } from "next/image";

export interface ProfileViewModel {
  name: string;
  job: string;
  spec: string[];
  introduction: string;
  profileImage: string | StaticImageData;
  githubLink: string;
  blogLink: string;
}
