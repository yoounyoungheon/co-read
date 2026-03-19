import type { Meta, StoryObj } from "@storybook/nextjs";
import type { Article } from "@/app/feature/article/business/article.domain";
import { ArticleList } from "./ArticleList";

const sampleArticles: Article[] = [
  {
    id: "1",
    title: "협업 문서 독해 경험을 개선하는 UI 설계",
    description:
      "복수 사용자가 같은 문서를 함께 읽고 상호작용할 때 필요한 피드백 구조와 인터랙션 설계 원칙을 정리한 글입니다.",
    url: "https://younghun123.tistory.com/1",
  },
  {
    id: "2",
    title: "프로덕트 감각을 살리는 프론트엔드 컴포넌트 설계",
    description:
      "단순한 UI 조립을 넘어서, 화면 문맥과 제품 흐름 안에서 컴포넌트를 어떻게 나눌지에 대한 고민을 담았습니다.",
    url: "https://younghun123.tistory.com/2",
  },
  {
    id: "3",
    title: "사용자 관점에서 다시 보는 아카이브 서비스 정보 구조",
    description:
      "콘텐츠 탐색 경험을 개선하기 위해 정보 구조를 어떻게 설계하고 검증했는지 사례 중심으로 정리했습니다.",
    url: "https://younghun123.tistory.com/3",
  },
];

const meta: Meta<typeof ArticleList> = {
  title: "Feature/profile/ArticleList",
  component: ArticleList,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    articles: sampleArticles,
  },
  argTypes: {
    articles: {
      control: "object",
      description: "리스트에 표시할 아티클 목록입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ArticleList>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[360px] max-w-full">
      <ArticleList {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    articles: [],
  },
  render: Default.render,
};

export const LongDescriptions: Story = {
  args: {
    articles: sampleArticles.map((article, index) => ({
      ...article,
      id: `${article.id}-long-${index}`,
      description: `${article.description} 실제 서비스 운영 과정에서 사용자 반응을 바탕으로 반복적으로 수정한 내용과 그에 따른 의사결정 흐름까지 함께 담았습니다.`,
    })),
  },
  render: Default.render,
};
