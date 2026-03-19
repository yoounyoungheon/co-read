import type { Meta, StoryObj } from "@storybook/nextjs";
import MarkdownViewer from "./markdown-viewer";
import markdownExample from "../../../../../docs/markdown-viewer.md?raw";

const architectureExcerpt = markdownExample
  .split("## 권장 아키텍처")[1]
  ?.split("## 컴포넌트 설계 원칙")[0]
  ?.trim();

const meta: Meta<typeof MarkdownViewer> = {
  title: "Components/MarkdownViewer",
  component: MarkdownViewer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    markdown: markdownExample,
  },
  argTypes: {
    markdown: {
      control: "text",
      description:
        "렌더링할 마크다운 문자열입니다. 기본값은 docs/markdown-viewer.md 내용을 사용합니다.",
    },
    className: {
      control: "text",
      description: "본문 wrapper에 추가할 Tailwind className입니다.",
    },
    variant: {
      control: "radio",
      options: ["default", "notion"],
      description: "마크다운 프리셋 스타일입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof MarkdownViewer>;

export const Default: Story = {
  render: (args) => (
    <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-sm">
      <MarkdownViewer {...args} />
    </div>
  ),
};

export const NarrowLayout: Story = {
  args: {
    markdown: architectureExcerpt ?? markdownExample,
  },
  render: (args) => (
    <div className="w-[720px] max-w-full rounded-2xl bg-white p-5 shadow-sm">
      <MarkdownViewer {...args} className="max-w-none" />
    </div>
  ),
};

export const Notion: Story = {
  args: {
    variant: "notion",
  },
  render: (args) => (
    <div className="w-full max-w-4xl rounded-2xl bg-[#fbfbfa] p-6 shadow-sm">
      <MarkdownViewer {...args} />
    </div>
  ),
};
