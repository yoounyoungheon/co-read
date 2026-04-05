import type { ReactNode } from "react";
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

const TIMELINE_CARD_BASE_CLASS =
  "overflow-hidden rounded-[28px] border-none shadow-[0_12px_32px_rgba(15,23,42,0.08)]";
const TIMELINE_CARD_LAYOUT_CLASS =
  "grid gap-4 p-5 sm:grid-cols-[200px_minmax(0,1fr)] sm:p-6";
const CONSISTENT_CARD_RING_CLASS = "ring-1 ring-slate-200/80";
const PANEL_EYEBROW_CLASS =
  "relative text-xs uppercase tracking-[0.2em] text-slate-400";
const PANEL_TITLE_CLASS = "relative mt-2 text-lg font-semibold text-slate-900";
const PANEL_BODY_CLASS =
  "relative mt-3 whitespace-pre-line text-sm leading-6 text-slate-600";
const PANEL_CARD_CLASS = "rounded-2xl px-4 py-4";
const PANEL_SECTION_LABEL_CLASS =
  "text-xs font-semibold uppercase tracking-[0.18em] text-slate-500";

type TimelineTone = ResumeBaseTimeLineItemViewModel["tone"];

type TimelineItemHeaderProps = Pick<
  ResumeBaseTimeLineItemViewModel,
  "tone" | "badge" | "title" | "period"
>;

type HighlightPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  className: string;
  titleClassName?: string;
  bodyClassName?: string;
  decorations?: ReactNode;
  aside?: ReactNode;
};

type TimelineCardShellProps = {
  header: TimelineItemHeaderProps;
  className: string;
  children: ReactNode;
};

type TagGroupPanelProps = {
  label: string;
  className?: string;
  children: ReactNode;
};

type TimelineEntryCardProps = {
  title: string;
  description: string;
  links: ResumeTimeLineLinkViewModel[];
  className: string;
  aside?: ReactNode;
  titleClassName?: string;
  bodyClassName?: string;
};

type ToneClassSet = {
  shell: string;
  panel: string;
  panelDecorations: ReactNode;
  tagPanel: string;
  entryCard: string;
};

const toneClassMap: Record<TimelineTone, ToneClassSet> = {
  slate: {
    shell: `${TIMELINE_CARD_BASE_CLASS} bg-white ${CONSISTENT_CARD_RING_CLASS}`,
    panel:
      "relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_52%,#f8f7ff_100%)] px-4 py-4 text-slate-900 ring-1 ring-slate-200/80",
    panelDecorations: (
      <>
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-100/70 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-16 w-16 rounded-full bg-violet-100/60 blur-2xl" />
      </>
    ),
    tagPanel: `${PANEL_CARD_CLASS} bg-slate-50 ${CONSISTENT_CARD_RING_CLASS}`,
    entryCard: `${PANEL_CARD_CLASS} bg-white ${CONSISTENT_CARD_RING_CLASS}`,
  },
  rose: {
    shell:
      `${TIMELINE_CARD_BASE_CLASS} bg-[linear-gradient(180deg,#fff7fb_0%,#ffffff_100%)] ${CONSISTENT_CARD_RING_CLASS}`,
    panel:
      "relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#fff8fb_0%,#ffffff_52%,#fff7fa_100%)] px-4 py-4 text-slate-900 ring-1 ring-rose-100",
    panelDecorations: (
      <>
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-100/70 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-16 w-16 rounded-full bg-pink-100/60 blur-2xl" />
      </>
    ),
    tagPanel: `${PANEL_CARD_CLASS} bg-white ${CONSISTENT_CARD_RING_CLASS}`,
    entryCard:
      `rounded-[24px] bg-white px-5 py-5 ${CONSISTENT_CARD_RING_CLASS} shadow-[0_10px_24px_rgba(244,114,182,0.08)]`,
  },
  blue: {
    shell:
      `${TIMELINE_CARD_BASE_CLASS} bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_100%)] ${CONSISTENT_CARD_RING_CLASS}`,
    panel:
      "relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#f6fbff_0%,#ffffff_52%,#f5f7ff_100%)] px-4 py-4 text-slate-900 ring-1 ring-blue-100",
    panelDecorations: (
      <>
        <div className="pointer-events-none absolute -right-10 -top-8 h-28 w-28 rounded-full bg-blue-100/70 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 right-12 h-16 w-16 rounded-full bg-cyan-100/70 blur-2xl" />
      </>
    ),
    tagPanel: `${PANEL_CARD_CLASS} bg-white ${CONSISTENT_CARD_RING_CLASS}`,
    entryCard:
      `whitespace-pre-line rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-600 ${CONSISTENT_CARD_RING_CLASS}`,
  },
  zinc: {
    shell:
      `${TIMELINE_CARD_BASE_CLASS} bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] ${CONSISTENT_CARD_RING_CLASS}`,
    panel:
      "relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#f7fbff_0%,#ffffff_52%,#f8fbff_100%)] px-4 py-4 text-slate-900 ring-1 ring-slate-200/80",
    panelDecorations: (
      <>
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100/60 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 right-12 h-16 w-16 rounded-full bg-sky-100/60 blur-2xl" />
      </>
    ),
    tagPanel: `${PANEL_CARD_CLASS} bg-white ${CONSISTENT_CARD_RING_CLASS}`,
    entryCard: `${PANEL_CARD_CLASS} bg-white ${CONSISTENT_CARD_RING_CLASS}`,
  },
};

export interface TimeLineProps {
  items: ResumeTimeLineItemViewModel[];
}

function SectionHeader({ tone, badge, title, period }: TimelineItemHeaderProps) {
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
      <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
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
              {link.header}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function TimelineCardShell({ header, className, children }: TimelineCardShellProps) {
  return (
    <Card className={className}>
      <div className={TIMELINE_CARD_LAYOUT_CLASS}>
        <SectionHeader {...header} />
        <div className="space-y-3">{children}</div>
      </div>
    </Card>
  );
}

function HighlightPanel({
  eyebrow,
  title,
  description,
  className,
  titleClassName = PANEL_TITLE_CLASS,
  bodyClassName = PANEL_BODY_CLASS,
  decorations,
  aside,
}: HighlightPanelProps) {
  return (
    <div className={className}>
      {decorations}
      {aside ? (
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className={PANEL_EYEBROW_CLASS}>{eyebrow}</p>
            <p className={titleClassName}>{title}</p>
          </div>
          <div className="relative">{aside}</div>
        </div>
      ) : (
        <>
          <p className={PANEL_EYEBROW_CLASS}>{eyebrow}</p>
          <p className={titleClassName}>{title}</p>
        </>
      )}
      <p className={bodyClassName}>{description}</p>
    </div>
  );
}

function TagGroupPanel({ label, className, children }: TagGroupPanelProps) {
  return (
    <Card className={className ?? `${PANEL_CARD_CLASS} shadow-none`}>
      <p className={PANEL_SECTION_LABEL_CLASS}>{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </Card>
  );
}

function TimelineEntryCard({
  title,
  description,
  links,
  className,
  aside,
  titleClassName = "text-sm font-semibold text-slate-900",
  bodyClassName = "mt-2 whitespace-pre-line text-sm leading-7 text-slate-600",
}: TimelineEntryCardProps) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p className={titleClassName}>{title}</p>
        {aside ? <div>{aside}</div> : null}
      </div>
      <p className={bodyClassName}>{description}</p>
      <ItemLinks links={links} />
    </div>
  );
}

function UniversityCard(item: ResumeUniversityTimeLineItemViewModel) {
  const toneClass = toneClassMap[item.tone];

  return (
    <TimelineCardShell header={item} className={toneClass.shell}>
      <HighlightPanel
        eyebrow="School"
        title={item.school}
        description={item.summary}
        className={toneClass.panel}
        decorations={toneClass.panelDecorations}
      />

      <div className="grid gap-3 lg:grid-cols-1">
        <TagGroupPanel label="전공" className={`${toneClass.tagPanel} shadow-none`}>
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
        </TagGroupPanel>

        <TagGroupPanel
          label="인상깊이 들었던 수업"
          className={`${toneClass.tagPanel} shadow-none`}
        >
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
        </TagGroupPanel>
      </div>
    </TimelineCardShell>
  );
}

function ClubCard(item: ResumeClubTimeLineItemViewModel) {
  const toneClass = toneClassMap[item.tone];

  return (
    <TimelineCardShell header={item} className={toneClass.shell}>
      <HighlightPanel
        eyebrow="Club"
        title="동아리"
        description={item.intro}
        className={toneClass.panel}
        bodyClassName="relative mt-3 whitespace-pre-line text-sm leading-7 text-slate-700"
        decorations={toneClass.panelDecorations}
      />

      <div className="grid gap-3 lg:grid-cols-1">
        {item.stories.map((story) => (
          <TimelineEntryCard
            key={story.title}
            title={story.title}
            description={story.description}
            links={story.links}
            className={toneClass.entryCard}
            titleClassName="text-sm font-semibold tracking-tight text-slate-900"
            bodyClassName="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600"
            aside={
              <Badge tone="rose" variant="outline" size="sm">
                {story.startTime} - {story.endTime}
              </Badge>
            }
          />
        ))}
      </div>
    </TimelineCardShell>
  );
}

function BootcampCard(item: ResumeBootcampTimeLineItemViewModel) {
  const toneClass = toneClassMap[item.tone];

  return (
    <TimelineCardShell header={item} className={toneClass.shell}>
      <HighlightPanel
        eyebrow="Program"
        title={item.program}
        description={item.programDescription}
        className={toneClass.panel}
        decorations={toneClass.panelDecorations}
      />

      <div className="grid gap-3 lg:grid-cols-1">
        <TagGroupPanel
          label="수상 및 성과"
          className={`${toneClass.tagPanel} shadow-none`}
        >
          {item.awards.map((award) => (
            <Badge
              key={award}
              tone="blue"
              variant="soft"
              className="max-w-full justify-start whitespace-normal break-words rounded-xl px-3 py-2 text-sm font-medium"
            >
              {award}
            </Badge>
          ))}
        </TagGroupPanel>

        <div className="space-y-2.5">
          {item.retrospective.map((retrospective) => (
            <TimelineEntryCard
              key={retrospective.title}
              title={retrospective.title}
              description={retrospective.description}
              links={retrospective.links}
              className={toneClass.entryCard}
            />
          ))}
        </div>
      </div>
    </TimelineCardShell>
  );
}

function WorkCard(item: ResumeWorkTimeLineItemViewModel) {
  const toneClass = toneClassMap[item.tone];

  return (
    <TimelineCardShell header={item} className={toneClass.shell}>
      <HighlightPanel
        eyebrow="Company"
        title={item.company}
        description={item.intro}
        className={toneClass.panel}
        titleClassName="mt-2 text-xl font-semibold text-slate-900"
        bodyClassName="relative mt-4 whitespace-pre-line text-sm leading-7 text-slate-600"
        decorations={toneClass.panelDecorations}
        aside={
          <div className="flex flex-wrap gap-2">
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
        }
      />

      <div className="grid gap-3">
        {item.experiences.map((experience) => (
          <TimelineEntryCard
            key={experience.title}
            title={experience.title}
            description={experience.description}
            links={experience.links}
            className={toneClass.entryCard}
          />
        ))}
      </div>
    </TimelineCardShell>
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
