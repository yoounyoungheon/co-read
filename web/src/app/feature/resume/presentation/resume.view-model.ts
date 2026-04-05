export type ResumeTimeLineTone = "slate" | "rose" | "blue" | "zinc";

export type ResumeTimeLineLinkViewModel = {
  header: string;
  path: string;
};

export type ResumeBaseTimeLineItemViewModel = {
  tone: ResumeTimeLineTone;
  badge: string;
  title: string;
  period?: string;
};

export type ResumeUniversityTimeLineItemViewModel =
  ResumeBaseTimeLineItemViewModel & {
    kind: "university";
    school: string;
    majors: string[];
    courses: string[];
    summary: string;
  };

export type ResumeClubTimeLineItemViewModel =
  ResumeBaseTimeLineItemViewModel & {
    kind: "club";
    intro: string;
    stories: {
      title: string;
      startTime: string;
      endTime: string;
      description: string;
      links: ResumeTimeLineLinkViewModel[];
    }[];
  };

export type ResumeBootcampTimeLineItemViewModel =
  ResumeBaseTimeLineItemViewModel & {
    kind: "bootcamp";
    program: string;
    programDescription: string;
    awards: string[];
    retrospective: {
      title: string;
      description: string;
      links: ResumeTimeLineLinkViewModel[];
    }[];
  };

export type ResumeWorkTimeLineItemViewModel =
  ResumeBaseTimeLineItemViewModel & {
    kind: "work";
    company: string;
    role: string;
    employmentPeriod: string;
    intro: string;
    experiences: {
      title: string;
      description: string;
      links: ResumeTimeLineLinkViewModel[];
    }[];
  };

export type ResumeTimeLineItemViewModel =
  | ResumeUniversityTimeLineItemViewModel
  | ResumeClubTimeLineItemViewModel
  | ResumeBootcampTimeLineItemViewModel
  | ResumeWorkTimeLineItemViewModel;
