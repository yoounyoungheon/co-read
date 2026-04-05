import Link from "next/link";
import Badge from "@/app/shared/ui/atom/badge";
import { Card } from "@/app/shared/ui/molecule/card";
import type {
  ResumeBaseTimeLineItemViewModel,
  ResumeBootcampTimeLineItemViewModel,
  ResumeClubTimeLineItemViewModel,
  ResumeTimeLineItemViewModel,
  ResumeTimeLineLinkViewModel,
  ResumeUniversityTimeLineItemViewModel,
  ResumeWorkTimeLineItemViewModel,
} from "../presentation/resume.view-model";

export interface TimeLineProps {
  items: ResumeTimeLineItemViewModel[];
}

function SectionHeader({
  tone,
  badge,
  title,
  period,
}: Pick<
  ResumeBaseTimeLineItemViewModel,
  "tone" | "badge" | "title" | "period"
>) {
  return (
    <div className="flex flex-col gap-3">
      <Badge
        tone={tone}
        variant="soft"
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

function ItemLinks({ links }: { links: ResumeTimeLineLinkViewModel[] }) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-col items-start">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        &lt;관련 링크&gt;
      </h3>
      <div className="mt-3 space-x-2">
        {links.map((link) => {
          const isExternal = /^https?:\/\//.test(link.path);

          return (
            <Link
              key={`${link.header}-${link.path}`}
              href={link.path}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer" : undefined}
              className="text-sm font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-900 hover:decoration-slate-500"
            >
              {link.header + `,`}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function UniversityCard(item: ResumeUniversityTimeLineItemViewModel) {
  return (
    <Card className="overflow-hidden rounded-[28px] border-none bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80">
      <div className="grid gap-4 p-5 sm:grid-cols-[200px_minmax(0,1fr)] sm:p-6">
        <SectionHeader {...item} />

        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_52%,#f8f7ff_100%)] px-4 py-4 text-slate-900 ring-1 ring-slate-200/80">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-100/70 blur-2xl" />
            <div className="pointer-events-none absolute bottom-0 right-10 h-16 w-16 rounded-full bg-violet-100/60 blur-2xl" />
            <p className="relative text-xs uppercase tracking-[0.22em] text-slate-400">
              School
            </p>
            <p className="relative mt-2 text-lg font-semibold text-slate-900">
              {item.school}
            </p>
            <p className="relative mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
              {item.summary}
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-1">
            <Card className="rounded-2xl px-4 py-4 shadow-none">
              <p className="text-xs font-semibold uppercase text-slate-500">
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
            </Card>

            <Card className="rounded-2xl px-4 py-4 shadow-none">
              <p className="text-xs font-semibold uppercase text-slate-500">
                인상깊이 들었던 수업
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
            </Card>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ClubCard(item: ResumeClubTimeLineItemViewModel) {
  return (
    <Card className="overflow-hidden rounded-[28px] border-none bg-[linear-gradient(180deg,#fff7fb_0%,#ffffff_100%)] shadow-[0_12px_32px_rgba(15,23,42,0.08)] ring-1 ring-rose-100">
      <div className="grid gap-4 p-5 sm:grid-cols-[200px_minmax(0,1fr)] sm:p-6">
        <SectionHeader {...item} />

        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#fff8fb_0%,#ffffff_52%,#fff7fa_100%)] px-4 py-4 text-slate-900 ring-1 ring-rose-100">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-100/70 blur-2xl" />
            <div className="pointer-events-none absolute bottom-0 right-10 h-16 w-16 rounded-full bg-pink-100/60 blur-2xl" />
            <p className="relative text-xs uppercase tracking-[0.2em] text-slate-400">
              Club
            </p>
            <p className="relative mt-2 text-lg font-semibold text-slate-900">
              동아리
            </p>
            <p className="relative mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
              {item.intro}
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-1">
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
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {story.description}
                </p>
                <ItemLinks links={story.links} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function BootcampCard(item: ResumeBootcampTimeLineItemViewModel) {
  return (
    <Card className="overflow-hidden rounded-[28px] border-none bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_100%)] shadow-[0_12px_32px_rgba(15,23,42,0.08)] ring-1 ring-blue-100">
      <div className="grid gap-4 p-5 sm:grid-cols-[200px_minmax(0,1fr)] sm:p-6">
        <SectionHeader {...item} />

        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#f6fbff_0%,#ffffff_52%,#f5f7ff_100%)] px-4 py-4 text-slate-900 ring-1 ring-blue-100">
            <div className="pointer-events-none absolute -right-10 -top-8 h-28 w-28 rounded-full bg-blue-100/70 blur-2xl" />
            <div className="pointer-events-none absolute bottom-0 right-12 h-16 w-16 rounded-full bg-cyan-100/70 blur-2xl" />
            <p className="relative text-xs uppercase tracking-[0.2em] text-slate-400">
              Program
            </p>
            <p className="relative mt-2 text-lg font-semibold text-slate-900">
              {item.program}
            </p>
            <p className="relative mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
              {item.programDescription}
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-1">
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

            <div className="space-y-2.5">
              {item.retrospective.map((retrospective) => (
                <div
                  key={retrospective.title}
                  className="whitespace-pre-line rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-600 ring-1 ring-blue-100"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {retrospective.title}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {retrospective.description}
                  </p>
                  <ItemLinks links={retrospective.links} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function WorkCard(item: ResumeWorkTimeLineItemViewModel) {
  return (
    <Card className="overflow-hidden rounded-[28px] border-none bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-[0_12px_32px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80">
      <div className="grid gap-4 p-5 sm:grid-cols-[200px_minmax(0,1fr)] sm:p-6">
        <SectionHeader {...item} />

        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#f7fbff_0%,#ffffff_52%,#f8fbff_100%)] px-4 py-4 text-slate-900 ring-1 ring-slate-200/80">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100/60 blur-2xl" />
            <div className="pointer-events-none absolute bottom-0 right-12 h-16 w-16 rounded-full bg-sky-100/60 blur-2xl" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Company
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {item.company}
                </p>
              </div>
              <div className="relative flex flex-wrap gap-2">
                <Badge
                  tone="zinc"
                  variant="outline"
                  size="sm"
                  className="border-slate-300 text-slate-700"
                >
                  {item.role}
                </Badge>
                <Badge
                  tone="zinc"
                  variant="outline"
                  size="sm"
                  className="border-slate-300 text-slate-700"
                >
                  {item.employmentPeriod}
                </Badge>
              </div>
            </div>
            <p className="relative mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
              {item.intro}
            </p>
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
                  <ItemLinks links={experience.links} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function renderItemCard(item: ResumeTimeLineItemViewModel) {
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
            따라가며 지금 어떤 개발자가 되었는지 소개할게요.
          </p>
        </div>

        <div className="relative mt-8 pl-8 sm:pl-10">
          <div className="absolute bottom-0 left-3 top-0 w-px bg-gradient-to-b from-fuchsia-400 via-violet-400 to-slate-200 sm:left-4" />

          <div className="space-y-5">
            {items.map((item, index) => (
              <div key={item.title} className="relative">
                <div className="absolute left-[-26px] top-7 h-4 w-4 rounded-full border-4 border-white bg-slate-900 shadow-[0_0_0_6px_rgba(216,180,254,0.45)] sm:left-[-32px]" />
                {renderItemCard(item)}
                {index !== items.length - 1 ? (
                  <div className="ml-2 mt-2 h-2 w-px bg-transparent sm:ml-3" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
