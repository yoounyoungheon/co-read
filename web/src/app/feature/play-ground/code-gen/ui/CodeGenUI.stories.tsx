import type { Meta, StoryObj } from "@storybook/nextjs";
import CodeGenUI from "./CodeGenUI";

const meta: Meta<typeof CodeGenUI> = {
  title: "Feature/play-ground/code-gen/CodeGenUI",
  component: CodeGenUI,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof CodeGenUI>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <CodeGenUI />
    </div>
  ),
};
