import type { Resume, ResumeItem } from "../business/resume.domain";
import type { ResumeTimeLineItemViewModel } from "./resume.view-model";

const presentResumeItem = (item: ResumeItem): ResumeTimeLineItemViewModel => {
  switch (item.kind) {
    case "university":
      return {
        kind: item.kind,
        tone: item.tone,
        badge: item.badge,
        title: item.title,
        period: item.period,
        school: item.school,
        majors: item.majors,
        courses: item.courses,
        summary: item.summary,
      };
    case "club":
      return {
        kind: item.kind,
        tone: item.tone,
        badge: item.badge,
        title: item.title,
        period: item.period,
        intro: item.intro,
        stories: item.stories,
      };
    case "bootcamp":
      return {
        kind: item.kind,
        tone: item.tone,
        badge: item.badge,
        title: item.title,
        period: item.period,
        program: item.program,
        programDescription: item.programDescription,
        awards: item.awards,
        retrospective: item.retrospective,
      };
    case "work":
      return {
        kind: item.kind,
        tone: item.tone,
        badge: item.badge,
        title: item.title,
        period: item.period,
        company: item.company,
        role: item.role,
        employmentPeriod: item.employmentPeriod,
        intro: item.intro,
        experiences: item.experiences,
      };
  }
};

export const presentResumeTimeLine = (
  resume: Resume,
): ResumeTimeLineItemViewModel[] => {
  return resume.items.map(presentResumeItem);
};
