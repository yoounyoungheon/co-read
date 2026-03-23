import type { Meta, StoryObj } from "@storybook/nextjs";
import markdownExample from "../../../../../../docs/markdown-viewer.md?raw";
import { ProjectReview } from "./ProjectReview";

const shortReview = `# 프로젝트 회고

## 배운 점

- SSR과 CSR의 역할을 더 명확하게 나눌 필요가 있었습니다.
- 공용 UI와 feature UI의 책임을 분리하니 구조가 더 단순해졌습니다.

## 다음 개선 포인트

1. 링크 정책을 명확히 정의하기
2. 코드 블록 렌더링을 커스터마이징하기
3. 실제 프로젝트 데이터와 연결하기`;

const meta: Meta<typeof ProjectReview> = {
  title: "Feature/project/ProjectReview",
  component: ProjectReview,
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
      description: "카드 내부에서 렌더링할 프로젝트 소개 마크다운 문자열입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProjectReview>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[720px] max-w-full">
      <ProjectReview {...args} />
    </div>
  ),
};

export const ShortReview: Story = {
  args: {
    markdown: shortReview,
  },
  render: Default.render,
};
