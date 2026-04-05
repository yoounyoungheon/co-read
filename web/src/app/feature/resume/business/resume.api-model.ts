export type ResumeToneApiModel = "slate" | "rose" | "blue" | "zinc";

export interface ResumeBaseItemApiModel {
  kind: "university" | "club" | "bootcamp" | "work";
  tone: ResumeToneApiModel;
  badge: string;
  title: string;
  period?: string;
}

export interface ResumeItemLinkApiModel {
  header: string;
  path: string;
}

export interface ResumeUniversityItemApiModel extends ResumeBaseItemApiModel {
  kind: "university";
  school: string;
  majors: string[];
  courses: string[];
  summary: string;
}

export interface ResumeClubStoryApiModel {
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  links: ResumeItemLinkApiModel[];
}

export interface ResumeClubItemApiModel extends ResumeBaseItemApiModel {
  kind: "club";
  intro: string;
  stories: ResumeClubStoryApiModel[];
}

export interface ResumeBootcampRetrospectiveApiModel {
  title: string;
  description: string;
  links: ResumeItemLinkApiModel[];
}

export interface ResumeBootcampItemApiModel extends ResumeBaseItemApiModel {
  kind: "bootcamp";
  program: string;
  programDescription: string;
  awards: string[];
  retrospective: ResumeBootcampRetrospectiveApiModel[];
}

export interface ResumeWorkExperienceApiModel {
  title: string;
  description: string;
  links: ResumeItemLinkApiModel[];
}

export interface ResumeWorkItemApiModel extends ResumeBaseItemApiModel {
  kind: "work";
  company: string;
  role: string;
  employmentPeriod: string;
  intro: string;
  experiences: ResumeWorkExperienceApiModel[];
}

export type ResumeItemApiModel =
  | ResumeUniversityItemApiModel
  | ResumeClubItemApiModel
  | ResumeBootcampItemApiModel
  | ResumeWorkItemApiModel;

export interface ResumeApiModel {
  items: ResumeItemApiModel[];
}
