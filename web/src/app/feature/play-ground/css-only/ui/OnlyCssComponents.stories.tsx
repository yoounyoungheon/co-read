import type { Meta, StoryObj } from "@storybook/nextjs";
import OnlyCssComponents from "./OnlyCssComponents";

const meta: Meta<typeof OnlyCssComponents> = {
  title: "Feature/play-ground/css-only/OnlyCssComponents",
  component: OnlyCssComponents,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
