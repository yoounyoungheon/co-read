import type { Meta, StoryObj } from "@storybook/nextjs";
import { Profile } from "./Profile";

const meta: Meta<typeof Profile> = {
  title: "Feature/profile/Profile",
  component: Profile,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    name: "윤영헌",
    job: "🖥️ developer",
    spec: ["Dongguk Univ · scsc & biz", "Open Labs · 2025 ~"],
    introduction:
      "안녕하세요! 개발자 윤영헌입니다.\n융합소프트웨어와 경영학을 전공했습니다.\n비즈니스, 기술적 관점에서 변화에 유연한 소프트웨어 설계를 고민합니다.\ne-mail: iddyoon@gmail.com",
    profileImage: "/images/profile.png",
    githubLink: "https://github.com/yoounyoungheon",
    blogLink: "https://younghun123.tistory.com/",
  },
  argTypes: {
    name: {
      control: "text",
      description: "프로필에 표시할 이름입니다.",
    },
    job: {
      control: "text",
      description: "이름 아래에 표시할 직업 또는 역할입니다.",
    },
    spec: {
      control: "object",
      description: "학력이나 이력처럼 줄 단위로 보여줄 경력 정보 목록입니다.",
    },
    introduction: {
      control: "text",
      description: "줄바꿈을 포함할 수 있는 자기소개 문구입니다.",
    },
    profileImage: {
      control: false,
      description: "프로필 사진으로 사용할 이미지입니다.",
    },
    githubLink: {
      control: "text",
      description: "GitHub 프로필 링크입니다.",
    },
    blogLink: {
      control: "text",
      description: "블로그 링크입니다.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Profile>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[360px] max-w-full">
      <Profile {...args} />
    </div>
  ),
};

export const LongIntroduction: Story = {
  args: {
    spec: [
      "Dongguk Univ · Convergence Software",
      "Business Administration · Double Major",
      "Open Labs · Backend Engineer",
    ],
    introduction:
      "사용자 경험과 제품 완성도를 함께 보는 개발을 지향합니다.\n빠르게 만드는 것보다 오래 유지되는 구조를 선호하고, 팀 안에서 문제를 명확히 정의하는 과정에도 관심이 많습니다.\n최근에는 서비스 설계와 실행 사이의 간극을 줄이는 방법을 고민하고 있습니다.",
  },
  render: Default.render,
};
