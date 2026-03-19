import type { Meta, StoryObj } from "@storybook/nextjs";
import type { Article } from "@/app/feature/article/business/article.domain";
import { ArticleCard } from "./ArticleCard";

const sampleArticle: Article = {
  id: "1",
  title: "협업 문서 독해 경험을 개선하는 UI 설계",
  description:
    "복수 사용자가 같은 문서를 함께 읽고 상호작용할 때 필요한 피드백 구조와 인터랙션 설계 원칙을 정리한 글입니다.",
  url: "https://younghun123.tistory.com/1",
};

const meta: Meta<typeof ArticleCard> = {
  title: "Feature/profile/ArticleCard",
  component: ArticleCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    article: sampleArticle,
  },
  argTypes: {
    article: {
      control: "object",
      description: "카드에 표시할 아티클 도메인 데이터입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ArticleCard>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[360px] max-w-full">
      <ArticleCard {...args} />
    </div>
  ),
};

export const LongTitle: Story = {
  args: {
    article: {
      ...sampleArticle,
      title:
        "협업형 읽기 서비스에서 사용자 집중을 해치지 않는 카드 UI와 링크 아웃 패턴 설계 방법",
    },
  },
  render: Default.render,
};
