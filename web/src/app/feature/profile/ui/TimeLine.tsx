import Badge from "@/app/shared/ui/atom/badge";
import { Card } from "@/app/shared/ui/molecule/card";

export type BaseTimeLineItem = {
  tone: "slate" | "rose" | "blue" | "zinc";
  badge: string;
  title: string;
  period?: string;
};

export type UniversityTimeLineItem = BaseTimeLineItem & {
  kind: "university";
  school: string;
  majors: string[];
  courses: string[];
  summary: string;
};

export type ClubTimeLineItem = BaseTimeLineItem & {
  kind: "club";
  intro: string;
  stories: {
    title: string;
    startTime: string;
    endTime: string;
    description: string;
  }[];
};

export type BootcampTimeLineItem = BaseTimeLineItem & {
  kind: "bootcamp";
  program: string;
  awards: string[];
  retrospective: string[];
};

export type WorkTimeLineItem = BaseTimeLineItem & {
  kind: "work";
  company: string;
  role: string;
  employmentPeriod: string;
  intro: string;
  experiences: {
    title: string;
    description: string;
  }[];
};

export type TimeLineItem =
  | UniversityTimeLineItem
  | ClubTimeLineItem
  | BootcampTimeLineItem
  | WorkTimeLineItem;

export interface TimeLineProps {
  items: TimeLineItem[];
}

export const defaultTimeLineItems: TimeLineItem[] = [
  {
    kind: "university",
    tone: "slate",
    badge: "University",
    title: "대학생",
    period: "2019 ~ 2025",
    school: "동국대학교",
    majors: ["융합소프트웨어", "경영학 복수전공"],
    courses: [
      "웹 프로그래밍",
      "데이터베이스",
      "운영체제",
      "컴퓨터 네트워크",
      "소프트웨어 공학",
    ],
    summary:
      "기술 구현을 넘어서 비즈니스와 제품 관점까지 함께 보는 기반을 대학 시절에 만들었습니다.",
  },
  {
    kind: "club",
    tone: "rose",
    badge: "Club & Build",
    title: "동아리",
    intro:
      "학교 밖으로 시선을 넓히며, 금융과 서비스 기획을 실제 문제에 연결해 보는 경험을 쌓았습니다.",
    stories: [
      {
        title: "금융 동아리",
        startTime: "2020.03",
        endTime: "2021.12",
        description:
          "금융 서비스가 사용자에게 어떤 방식으로 전달되는지, 문제를 어떻게 정의하고 풀어야 하는지에 관심을 갖게 된 계기였습니다. 기술과 도메인이 만나는 지점을 자연스럽게 고민하기 시작했습니다.",
      },
      {
        title: "창업 프로젝트",
        startTime: "2022.03",
        endTime: "2022.12",
        description:
          "아이디어를 제품 형태로 구체화하며 역할 분담, 빠른 검증, 우선순위 설정의 중요성을 배웠습니다. 구현 이전에 무엇을 먼저 풀어야 하는지 정리하는 힘을 많이 길렀습니다.",
      },
    ],
  },
  {
    kind: "bootcamp",
    tone: "blue",
    badge: "Bootcamp",
    title: "디지털 하나로",
    period: "금융 IT 부트캠프",
    program: "실무형 팀 프로젝트 중심 과정",
    awards: ["프로젝트 최우수상 수상", "금융 도메인 기반 서비스 설계 경험"],
    retrospective: [
      "짧은 일정 안에서도 구조적 품질을 놓치지 않는 것이 중요하다는 점을 체감했습니다.",
      "기능 구현, 협업, 배포까지 하나의 흐름으로 연결해 보는 실전 감각을 얻었습니다.",
    ],
  },
  {
    kind: "work",
    tone: "zinc",
    badge: "Work",
    title: "Openlabs",
    company: "Openlabs",
    role: "Frontend Developer",
    employmentPeriod: "2026.6 ~ now",
    intro:
      "실제 제품과 프로젝트를 만들며 프론트엔드, 백엔드, 인프라를 연결해서 보는 개발 경험을 쌓고 있습니다.",
    experiences: [
      {
        title: "프로덕트 화면 설계와 구현",
        description:
          "서비스 요구사항을 실제 사용자 흐름에 맞는 화면으로 구체화했습니다.\n디자인 의도를 해치지 않으면서도 유지보수 가능한 컴포넌트 구조를 만드는 데 집중했습니다.",
      },
      {
        title: "프론트엔드 아키텍처 개선",
        description:
          "SSR, BFF, 상태 분리 같은 구조적 주제를 실무 안에서 계속 다뤘습니다.\n기능 추가 속도와 코드 품질이 함께 유지될 수 있는 방향을 고민했습니다.",
      },
      {
        title: "프로젝트 전반 협업",
        description:
          "백엔드, 인프라, 제품 요구사항을 함께 보면서 기능을 연결했습니다.\n지금은 단순 구현을 넘어서 오래 유지될 구조와 제품 경험을 함께 설계하는 개발자를 지향합니다.",
      },
    ],
  },
];

function SectionHeader({
  tone,
  badge,
  title,
  period,
}: Pick<TimeLineItem, "tone" | "badge" | "title" | "period">) {
  return (
    <div className="flex flex-col gap-3">
      <Badge
        tone={tone}
        variant="solid"
        size="sm"
        className="w-fit uppercase tracking-[0.22em]"
      >
        {badge}
      </Badge>
      <div>
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        {period ? (
          <p className="mt-2 text-sm font-medium text-slate-500">{period}</p>
        ) : null}
      </div>
    </div>
  );
}

function UniversityCard(item: UniversityTimeLineItem) {
  return (
    <Card className="overflow-hidden rounded-[28px] border-none bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80">
      <div className="grid gap-5 p-5 sm:grid-cols-[200px_minmax(0,1fr)] sm:p-6">
        <SectionHeader {...item} />

        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900 px-4 py-4 text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-white/55">
              School
            </p>
            <p className="mt-2 text-lg font-semibold">{item.school}</p>
            <p className="mt-3 text-sm leading-6 text-white/75">
              {item.summary}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-1">
            <div className="rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-200/70">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                전공
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.majors.map((major) => (
                  <Badge
                    key={major}
                    tone="slate"
                    variant="soft"
                    className="text-sm font-medium"
                  >
                    {major}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-200/70">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                들었던 수업
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.courses.map((course) => (
                  <Badge
                    key={course}
                    tone="slate"
                    variant="outline"
                    className="text-sm"
                  >
                    {course}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ClubCard(item: ClubTimeLineItem) {
  return (
    <Card className="overflow-hidden rounded-[28px] border-none bg-[linear-gradient(180deg,#fff7fb_0%,#ffffff_100%)] shadow-[0_12px_32px_rgba(15,23,42,0.08)] ring-1 ring-rose-100">
      <div className="grid gap-5 p-5 sm:grid-cols-[200px_minmax(0,1fr)] sm:p-6">
        <SectionHeader {...item} />

        <div className="space-y-4">
          <p className="rounded-2xl border border-rose-100 bg-white px-4 py-4 text-sm leading-7 text-slate-700">
            {item.intro}
          </p>

          <div className="grid gap-4 lg:grid-cols-1">
            {item.stories.map((story) => (
              <div
                key={story.title}
                className="rounded-[24px] bg-white px-5 py-5 ring-1 ring-rose-100 shadow-[0_10px_24px_rgba(244,114,182,0.08)]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <p className="text-sm font-semibold tracking-tight text-slate-900">
                    {story.title}
                  </p>
                  <Badge tone="rose" variant="outline" size="sm">
                    {story.startTime} - {story.endTime}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {story.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function BootcampCard(item: BootcampTimeLineItem) {
  return (
    <Card className="overflow-hidden rounded-[28px] border-none bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_100%)] shadow-[0_12px_32px_rgba(15,23,42,0.08)] ring-1 ring-blue-100">
      <div className="grid gap-5 p-5 sm:grid-cols-[200px_minmax(0,1fr)] sm:p-6">
        <SectionHeader {...item} />

        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900 px-4 py-4 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">
              Program
            </p>
            <p className="mt-2 text-lg font-semibold">{item.program}</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-1">
            <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-blue-100">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                수상 및 성과
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.awards.map((award) => (
                  <Badge
                    key={award}
                    tone="blue"
                    variant="soft"
                    className="max-w-full whitespace-normal break-words justify-start rounded-xl px-3 py-2 text-sm font-medium"
                  >
                    {award}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {item.retrospective.map((text) => (
                <div
                  key={text}
                  className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-600 ring-1 ring-blue-100"
                >
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function WorkCard(item: WorkTimeLineItem) {
  return (
    <Card className="overflow-hidden rounded-[28px] border-none bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-[0_12px_32px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80">
      <div className="grid gap-5 p-5 sm:grid-cols-[200px_minmax(0,1fr)] sm:p-6">
        <SectionHeader {...item} />

        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900 px-4 py-4 text-white">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Company
                </p>
                <p className="mt-2 text-xl font-semibold">{item.company}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  tone="zinc"
                  variant="outline"
                  size="sm"
                  className="border-white/25 text-white"
                >
                  {item.role}
                </Badge>
                <Badge
                  tone="zinc"
                  variant="outline"
                  size="sm"
                  className="border-white/25 text-white"
                >
                  {item.employmentPeriod}
                </Badge>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/75">{item.intro}</p>
          </div>

          <div className="grid gap-3">
            {item.experiences.map((experience) => (
              <div
                key={experience.title}
                className="rounded-2xl bg-white px-4 py-4 ring-1 ring-slate-200/80"
              >
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {experience.title}
                  </p>
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                    {experience.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function renderItemCard(item: TimeLineItem) {
  switch (item.kind) {
    case "university":
      return <UniversityCard {...item} />;
    case "club":
      return <ClubCard {...item} />;
    case "bootcamp":
      return <BootcampCard {...item} />;
    case "work":
      return <WorkCard {...item} />;
    default:
      return null;
  }
}

export function TimeLine({ items }: TimeLineProps) {
  return (
    <section className="w-full max-w-6xl">
      <div className="rounded-[32px] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,250,252,0.96))] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80 sm:p-7">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
            About Me
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            타임라인으로 보는 윤영헌
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            학교에서 시작해 동아리, 부트캠프, 실무 경험까지 이어진 흐름을
            따라가며 지금 어떤 개발자가 되었는지 소개합니다.
          </p>
        </div>

        <div className="relative mt-10 pl-8 sm:pl-10">
          <div className="absolute bottom-0 left-3 top-0 w-px bg-gradient-to-b from-fuchsia-400 via-violet-400 to-slate-200 sm:left-4" />

          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={item.title} className="relative">
                <div className="absolute left-[-26px] top-7 h-4 w-4 rounded-full border-4 border-white bg-slate-900 shadow-[0_0_0_6px_rgba(216,180,254,0.45)] sm:left-[-32px]" />
                {renderItemCard(item)}
                {index !== items.length - 1 ? (
                  <div className="ml-2 mt-3 h-3 w-px bg-transparent sm:ml-3" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
