export type ResumeTone = "slate" | "rose" | "blue" | "zinc";

export interface ResumeBaseItem {
  kind: "university" | "club" | "bootcamp" | "work";
  tone: ResumeTone;
  badge: string;
  title: string;
  period?: string;
}

export interface ResumeUniversityItem extends ResumeBaseItem {
  kind: "university";
  school: string;
  majors: string[];
  courses: string[];
  summary: string;
}

export interface ResumeClubStory {
  title: string;
  startTime: string;
  endTime: string;
  description: string;
}

export interface ResumeClubItem extends ResumeBaseItem {
  kind: "club";
  intro: string;
  stories: ResumeClubStory[];
}

export interface ResumeBootcampItem extends ResumeBaseItem {
  kind: "bootcamp";
  program: string;
  awards: string[];
  retrospective: string[];
}

export interface ResumeWorkExperience {
  title: string;
  description: string;
}

export interface ResumeWorkItem extends ResumeBaseItem {
  kind: "work";
  company: string;
  role: string;
  employmentPeriod: string;
  intro: string;
  experiences: ResumeWorkExperience[];
}

export type ResumeItem =
  | ResumeUniversityItem
  | ResumeClubItem
  | ResumeBootcampItem
  | ResumeWorkItem;

export interface Resume {
  items: ResumeItem[];
}

export const createResumeDomain = (items: ResumeItem[]): Resume => {
  return {
    items,
  };
};
