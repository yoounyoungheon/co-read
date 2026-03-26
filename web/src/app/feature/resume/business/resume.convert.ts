import type { TimeLineItem } from "@/app/feature/resume/ui/TimeLine";
import type { Resume, ResumeItem } from "./resume.domain";

const convertResumeItemToTimeLineItem = (item: ResumeItem): TimeLineItem => {
  switch (item.kind) {
    case "university":
      return {
        kind: "university",
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
        kind: "club",
        tone: item.tone,
        badge: item.badge,
        title: item.title,
        period: item.period,
        intro: item.intro,
        stories: item.stories,
      };
    case "bootcamp":
      return {
        kind: "bootcamp",
        tone: item.tone,
        badge: item.badge,
        title: item.title,
        period: item.period,
        program: item.program,
        awards: item.awards,
        retrospective: item.retrospective,
      };
    case "work":
      return {
        kind: "work",
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

export const convertResumeToTimeLineItems = (
  resume: Resume,
): TimeLineItem[] => {
  return resume.items.map(convertResumeItemToTimeLineItem);
};
