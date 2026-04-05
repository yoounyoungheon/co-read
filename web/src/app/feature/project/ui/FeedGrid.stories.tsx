import type { Meta, StoryObj } from "@storybook/nextjs";
import type { ProjectCardViewModel } from "../presentation/project.view-model";
import { FeedGrid } from "./FeedGrid";

const createPlaceholderImage = (label: string, fill: string) =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><rect width='600' height='600' fill='${fill}'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%230f172a' font-size='40' font-family='sans-serif'>${label}</text></svg>`;

const sampleProjects: ProjectCardViewModel[] = [
  {
    id: "co-read",
    title: "Co-Read",
    keyword: ["Next.js", "NestJS", "Vercel"],
    href: "/project?id=co-read",
    imageSrc: createPlaceholderImage("Co-Read", "%23dbeafe"),
  },
  {
    id: "open-labs",
    title: "Open Labs",
    keyword: ["React", "Spring Boot", "AWS"],
    href: "/project?id=open-labs",
    imageSrc: createPlaceholderImage("Open Labs", "%23fde68a"),
  },
  {
    id: "note-flow",
    title: "Note Flow",
    keyword: ["Next.js", "Go", "Cloud Run"],
    href: "/project?id=note-flow",
    imageSrc: createPlaceholderImage("Note Flow", "%23bfdbfe"),
  },
  {
    id: "focus-board",
    title: "Focus Board",
    keyword: ["Vue", "FastAPI", "GCP"],
    href: "/project?id=focus-board",
    imageSrc: createPlaceholderImage("Focus Board", "%23fecaca"),
  },
];

const meta: Meta<typeof FeedGrid> = {
  title: "Feature/project/FeedGrid",
  component: FeedGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    projects: sampleProjects,
  },
  argTypes: {
    projects: {
      control: "object",
      description: "그리드에 표시할 프로젝트 목록입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof FeedGrid>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[320px] max-w-full md:w-[960px]">
      <FeedGrid {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    projects: [],
  },
  render: Default.render,
};
