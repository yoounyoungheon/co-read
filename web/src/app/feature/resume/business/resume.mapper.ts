import {
  Resume,
  ResumeItem,
  createResumeDomain,
} from "./resume.domain";
import { ResumeApiModel, ResumeItemApiModel } from "./resume.api-model";

const mapResumeItemApiModelToDomain = (
  item: ResumeItemApiModel,
): ResumeItem => {
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
        stories: item.stories.map((story) => ({
          title: story.title,
          startTime: story.startTime,
          endTime: story.endTime,
          description: story.description,
          links: story.links.map((link) => ({
            header: link.header,
            path: link.path,
          })),
        })),
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
        awards: [...item.awards],
        retrospective: item.retrospective.map((entry) => ({
          title: entry.title,
          description: entry.description,
          links: entry.links.map((link) => ({
            header: link.header,
            path: link.path,
          })),
        })),
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
        experiences: item.experiences.map((experience) => ({
          title: experience.title,
          description: experience.description,
          links: experience.links.map((link) => ({
            header: link.header,
            path: link.path,
          })),
        })),
      };
  }
};

export const mapResumeApiModelToDomain = (
  resume: ResumeApiModel,
): Resume => {
  return createResumeDomain(resume.items.map(mapResumeItemApiModelToDomain));
};
